import unidecode from 'unidecode'

export const convertToSlug = (text: string): string => {
  const textUnidecode: string = unidecode(text)
  const textToSlug = textUnidecode.trim().replace(/\s+/g, '-')

  return textToSlug
} 