/**
 * The full set of translations.
 *
 * @type {object}
 */
const TRANSLATIONS = {
  en: {
    challenge: {
      statement: 'Statement:',
    },
    closest_solution: {
      title: 'Closest solution:',
    },
    corrected_answer: {
      title: 'Corrected answer:',
    },
    modal: {
      close: 'Close',
      fit_to_content: 'Fit to content',
      maximize: 'Maximize',
      minimize: 'Minimize',
    },
    pagination: {
      go_to_first: 'Go to first page',
      go_to_last: 'Go to last page',
      go_to_page: 'Go to page {{page}}',
      go_to_next: 'Go to next page',
      go_to_previous: 'Go to previous page',
    },
    solution_link: {
      label: 'Solutions ({{count}})',
    },
    solution_list: {
      all: 'all',
      alphabetical_sort: 'Alphabetical sort',
      correct_solutions: 'Correct solutions:',
      filter: 'Filter:',
      no_matching_solution: 'There is no matching solution.',
      per_page: 'per page:',
      similarity_sort: 'Similarity sort',
      sort_ascending: 'Sort in ascending order',
      sort_alphabetically: 'Sort alphabetically',
      sort_by_similarity: 'Sort by similarity',
      sort_descending: 'Sort in descending order',
      view_list_with_word: 'View solutions with "{{word}}"',
      view_list_without_word: 'View solutions without "{{word}}"',
    },
    user_reference: {
      cancel: 'Cancel',
      none: 'None yet',
      pin: 'Pin',
      title: 'Your reference:',
      unpin: 'Unpin',
      update: 'Update',
    },
    word_filter: {
      absent: 'Absent',
      add_filter: 'Add a filter',
      anywhere_in_solution: 'Anywhere in the solution',
      anywhere_in_word: 'Anywhere in a word',
      at_solution_end: 'At the end of the solution',
      at_solution_start: 'At the start of the solution',
      at_word_end: 'At the end of a word',
      at_word_start: 'At the start of a word',
      click_to_remove_filter: 'Click to remove filter',
      exact_solution: 'Exact solution',
      exact_word: 'Exact word',
      present: 'Present',
    },
  },
  fr: {
    challenge: {
      statement: 'Énoncé :',
    },
    closest_solution: {
      title: 'Solution la plus proche :',
    },
    corrected_answer: {
      title: 'Réponse corrigée :',
    },
    modal: {
      close: 'Fermer',
      fit_to_content: 'Adapter au contenu',
      maximize: 'Maximiser',
      minimize: 'Minimiser',
    },
    pagination: {
      go_to_first: 'Aller à la première page',
      go_to_last: 'Aller à la dernière page',
      go_to_page: 'Aller à la page {{page}}',
      go_to_next: 'Aller à la page suivante',
      go_to_previous: 'Aller à la page précédente',
    },
    solution_link: {
      label: 'Solutions ({{count}})',
    },
    solution_list: {
      all: 'tout',
      alphabetical_sort: 'Tri alphabétique',
      correct_solutions: 'Solutions correctes :',
      filter: 'Filtrer:',
      no_matching_solution: 'Il n\'y a aucune solution correspondante.',
      per_page: 'par page :',
      similarity_sort: 'Tri par similarité',
      sort_ascending: 'Trier par ordre croissant',
      sort_alphabetically: 'Trier alphabétiquement',
      sort_by_similarity: 'Trier par similarité',
      sort_descending: 'Trier par ordre décroissant',
      view_list_with_word: 'Voir les solutions avec "{{word}}"',
      view_list_without_word: 'Voir les solutions sans "{{word}}"',
    },
    user_reference: {
      cancel: 'Annuler',
      none: 'Aucune pour l\'instant',
      pin: 'Épingler',
      unpin: 'Désépingler',
      update: 'Modifier',
      your_reference: 'Ta référence :',
    },
    word_filter: {
      absent: 'Absent',
      add_filter: 'Ajouter un filtre',
      anywhere_in_solution: 'N\'importe où dans la solution',
      anywhere_in_word: 'N\'importe où dans un mot',
      at_solution_end: 'À la fin de la solution',
      at_solution_start: 'Au début de la solution',
      at_word_end: 'À la fin d\'un mot',
      at_word_start: 'Au début d\'un mot',
      click_to_remove_filter: 'Cliquer pour enlever le filtre',
      exact_solution: 'Solution exacte',
      exact_word: 'Mot exact',
      present: 'Présent',
    },
  },
};

/**
 * @param {string} languageTag A language tag.
 * @returns {object} The available translations for the given language tag.
 */
export function getTranslations(languageTag) {
  return (
    TRANSLATIONS[languageTag] || TRANSLATIONS[languageTag.substring(0, 2)] || {}
  );
}
