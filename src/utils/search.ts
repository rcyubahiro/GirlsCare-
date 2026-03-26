/**
 * Search and filter utilities
 */

export const searchText = (text: string, query: string): boolean => {
  return text.toLowerCase().includes(query.toLowerCase());
};

export const searchQuestions = <T extends { content: string; mentorResponses?: { message: string }[] }>(
  questions: T[],
  query: string
): T[] => {
  if (!query.trim()) return questions;
  
  return questions.filter((q) => 
    searchText(q.content, query) ||
    q.mentorResponses?.some((r) => searchText(r.message, query))
  );
};

export const searchFacilities = <T extends { name: string; location: string; contact: string }>(
  facilities: T[],
  query: string
): T[] => {
  if (!query.trim()) return facilities;
  
  return facilities.filter((f) =>
    searchText(f.name, query) ||
    searchText(f.location, query) ||
    searchText(f.contact, query)
  );
};

export const searchTopics = <T extends { title: string; summary: string; details?: string }>(
  topics: T[],
  query: string
): T[] => {
  if (!query.trim()) return topics;
  
  return topics.filter((t) =>
    searchText(t.title, query) ||
    searchText(t.summary, query) ||
    searchText(t.details || '', query)
  );
};
