//Checks forbiddenwords, returns a boolean
function containsForbiddenWords(response, forbiddenWords) {
  // lowercase and split into words
  const words = response.toLowerCase().split(/\s+/);
  // Create a Set of forbidden words for faster lookup
  const forbiddenSet = new Set(
    forbiddenWords.map((word) => word.toLowerCase())
  );
  // Check
  for (const word of words) {
    if (forbiddenSet.has(word)) {
      return true;
    }
  }
  return false;
}

// Checks for forbidden phrases, returns a boolean
function containsForbiddenPhrases(forbiddenPhrases, text) {
  const lowerCaseText = text.toLowerCase();
  // Check
  for (const phrase of forbiddenPhrases) {
    if (lowerCaseText.includes(phrase.toLowerCase())) {
      return true;
    }
  }
  return false;
}

export { containsForbiddenWords, containsForbiddenPhrases };
