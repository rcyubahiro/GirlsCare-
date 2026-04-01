import { useEffect, useMemo, useState } from 'react';
import { ChatBubbleBottomCenterTextIcon, PaperAirplaneIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import Button from '../components/Button';
import Card from '../components/Card';
import PageIllustration from '../components/PageIllustration';
import {
  fetchMentorMessages,
  fetchMentors,
  fetchTypingStatus,
  markMentorMessagesRead,
  sendMentorMessage,
  sendTypingStatus,
} from '../api/mentorChatService';
import type { Mentor, MentorChatMessage } from '../types';
import { decryptMessage, encryptMessage } from '../utils/chatCrypto';
import { loadMentorMessages, saveMentorMessages } from '../utils/storage';

function anonymizedAlias(): string {
  const saved = localStorage.getItem('girlcare-anon-alias');
  if (saved) {
    return saved;
  }

  const generated = `Anonymous-${Math.floor(1000 + Math.random() * 9000)}`;
  localStorage.setItem('girlcare-anon-alias', generated);
  return generated;
}

export default function MentorChatPage() {
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [activeMentorId, setActiveMentorId] = useState('');
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<MentorChatMessage[]>(() => loadMentorMessages());
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [mentorTyping, setMentorTyping] = useState(false);

  const alias = useMemo(() => anonymizedAlias(), []);

  useEffect(() => {
    let mounted = true;

    fetchMentors()
      .then((items) => {
        if (!mounted) {
          return;
        }
        setMentors(items);
        setActiveMentorId((current) => current || items[0]?.id || '');
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setChatError('Unable to load mentors right now. Please try again.');
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!activeMentorId) {
      return;
    }

    let mounted = true;

    const loadConversation = async () => {
      setLoadingMessages(true);
      try {
        const [encryptedMessages, mentorIsTyping] = await Promise.all([
          fetchMentorMessages(activeMentorId),
          fetchTypingStatus(activeMentorId).catch(() => false),
        ]);
        const decrypted = await Promise.all(
          encryptedMessages.map(async (item) => ({
            id: item.id,
            mentorId: item.mentorId,
            sender: item.sender,
            createdAt: item.createdAt,
            deliveredAt: item.deliveredAt,
            readAt: item.readAt,
            content: await decryptMessage(item.encryptedContent),
          })),
        );

        if (!mounted) {
          return;
        }

        setMessages((previousMessages) => {
          const mergedById = new Map<string, MentorChatMessage>();
          [...previousMessages.filter((message) => message.mentorId !== activeMentorId), ...decrypted].forEach((message) => {
            mergedById.set(message.id, message);
          });
          const merged = Array.from(mergedById.values());
          saveMentorMessages(merged);
          return merged;
        });
        setMentorTyping(mentorIsTyping);
        setChatError(null);

        const latestMentorMessage = decrypted
          .filter((message) => message.sender === 'mentor')
          .slice()
          .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
          .at(-1);

        if (latestMentorMessage) {
          void markMentorMessagesRead(activeMentorId, latestMentorMessage.id).catch(() => {
            // Keep UI usable even when read receipt endpoint is unavailable.
          });
        }
      } catch {
        if (!mounted) {
          return;
        }
        setChatError('Chat server is unavailable. Messages are shown from local cache only.');
      } finally {
        if (mounted) {
          setLoadingMessages(false);
        }
      }
    };

    loadConversation();
    const poll = window.setInterval(loadConversation, 15000);

    return () => {
      mounted = false;
      window.clearInterval(poll);
    };
  }, [activeMentorId]);

  const conversation = messages
    .filter((message) => message.mentorId === activeMentorId)
    .slice()
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  const activeMentor = mentors.find((mentor) => mentor.id === activeMentorId) ?? mentors[0];

  const persistMessages = (next: MentorChatMessage[]) => {
    setMessages(next);
    saveMentorMessages(next);
  };

  const sendMessage = async () => {
    if (!draft.trim() || sending) {
      return;
    }

    const content = draft.trim();
    setDraft('');
    setSending(true);
    setChatError(null);

    const userMessage: MentorChatMessage = {
      id: `msg-user-${Date.now()}`,
      mentorId: activeMentorId,
      sender: 'user',
      content,
      createdAt: new Date().toISOString(),
      deliveredAt: undefined,
      readAt: undefined,
    };

    const nextWithUser = [...messages, userMessage];
    persistMessages(nextWithUser);

    try {
      const encrypted = await encryptMessage(content);
      await sendMentorMessage({
        mentorId: activeMentorId,
        alias,
        encryptedContent: encrypted,
      });

      const nowIso = new Date().toISOString();
      const withDelivered = nextWithUser.map((message) =>
        message.id === userMessage.id ? { ...message, deliveredAt: nowIso } : message,
      );
      persistMessages(withDelivered);
    } catch {
      setChatError('Your message was saved locally, but delivery to mentor server failed.');
    } finally {
      setSending(false);
      void sendTypingStatus(activeMentorId, false).catch(() => {
        // Typing endpoint is optional in degraded mode.
      });
    }
  };

  const handleDraftChange = (value: string) => {
    setDraft(value);
    if (!activeMentorId) {
      return;
    }

    void sendTypingStatus(activeMentorId, value.trim().length > 0).catch(() => {
      // Typing endpoint is optional in degraded mode.
    });
  };

  const getReceiptLabel = (message: MentorChatMessage): string => {
    if (message.sender !== 'user') {
      return new Date(message.createdAt).toLocaleTimeString();
    }
    if (message.readAt) {
      return 'Read';
    }
    if (message.deliveredAt) {
      return 'Delivered';
    }
    return 'Sent';
  };

  return (
    <div className="space-y-4 pb-20 animate-fadeInUp">
      <PageIllustration
        badge="Mentors"
        title="Anonymous Mentor Space"
        subtitle="Chat privately with known mentors while keeping your identity anonymous."
        icon={ChatBubbleBottomCenterTextIcon}
      />

      <Card className="border-primary/20 bg-primary/5 dark:border-primary/30 dark:bg-primary/10">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
          <ShieldCheckIcon className="h-4 w-4" /> You are chatting as {alias}
        </p>
      </Card>

      {chatError ? (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-700 dark:bg-amber-900/20">
          <p className="text-sm text-amber-800 dark:text-amber-300">{chatError}</p>
        </Card>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">Known Mentors</h2>
          <ul className="mt-3 space-y-2">
            {mentors.map((mentor) => {
              const active = mentor.id === activeMentorId;
              return (
                <li key={mentor.id}>
                  <button
                    onClick={() => setActiveMentorId(mentor.id)}
                    className={[
                      'w-full rounded-xl border px-3 py-2 text-left transition',
                      active
                        ? 'border-primary bg-primary/10 dark:bg-primary/20'
                        : 'border-slate-200 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800',
                    ].join(' ')}
                  >
                    <p className="text-sm font-semibold text-textBase dark:text-slate-100">{mentor.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{mentor.specialty}</p>
                    <p className="mt-1 text-xs font-semibold text-primary">{mentor.availability}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="flex min-h-[420px] flex-col">
          <h2 className="font-heading text-lg font-semibold text-textBase dark:text-slate-100">
            Chat with {activeMentor?.name ?? 'Mentor'}
          </h2>

          <div className="mt-3 flex-1 space-y-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/60">
            {loadingMessages ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Loading messages...</p>
            ) : conversation.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400">Start a conversation. Your identity stays anonymous.</p>
            ) : (
              conversation.map((message) => (
                <div
                  key={message.id}
                  className={[
                    'max-w-[85%] rounded-2xl px-3 py-2 text-sm',
                    message.sender === 'user'
                      ? 'ml-auto bg-primary text-white'
                      : 'bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-200',
                  ].join(' ')}
                >
                  <p>{message.content}</p>
                  <p className="mt-1 text-[11px] opacity-70">{getReceiptLabel(message)}</p>
                </div>
              ))
            )}

            {mentorTyping ? (
              <p className="text-xs font-semibold text-primary">{activeMentor?.name ?? 'Mentor'} is typing...</p>
            ) : null}
          </div>

          <div className="mt-3 flex gap-2">
            <input
              value={draft}
              onChange={(event) => handleDraftChange(event.target.value)}
              placeholder="Type your message..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary dark:border-slate-700 dark:bg-slate-800"
            />
            <Button onClick={sendMessage} disabled={!draft.trim() || sending}>
              <span className="inline-flex items-center gap-1">
                Send <PaperAirplaneIcon className="h-4 w-4" />
              </span>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
