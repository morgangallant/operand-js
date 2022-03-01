import * as React from 'react';
import { Dialog } from '@headlessui/react';

// SearchResult is a single search result.
type SearchResult = {
  document: string;
  set: string;
  properties: {
    title?: string;
    url?: string;
    lang?: string;
  };
  tags: string[];
  snippets: string[];
};

// SearchResponse is the type returned from the Operand API.
type SearchResponse = {
  id: string;
  duration_ms: number;
  results: SearchResult[];
};

// SearchModal appears when the user is going to search.
const SearchModal: React.FC<{
  shown: boolean;
  searchPlaceholder?: string;
  onClose: () => void;
  doSearch: (query: string) => Promise<SearchResponse>;
  onClick: (searchId: string, result: SearchResult) => void;
}> = ({ shown, searchPlaceholder, onClose, doSearch, onClick }) => {
  // Current search query.
  const [query, setQuery] = React.useState('');

  // The result set currently being displayed.
  const [activeResponse, setActiveResponse] =
    React.useState<SearchResponse | null>(null);

  // The index of the selected result.
  // -1 means no result is selected.
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  // A ref to the search input.
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // A ref to the search result list.
  const searchResultsRef = React.useRef<HTMLDivElement>(null);

  // When shown changes, we need to reset the query and response.
  React.useEffect(() => {
    if (shown) {
      setQuery('');
      setActiveResponse(null);
    }
  }, [shown]);

  // As the user types, fire searches.
  React.useEffect(() => {
    let currentQuery = query;
    if (currentQuery.length == 0) {
      setActiveResponse(null);
      return;
    }
    const delayed = setTimeout(async () => {
      const res = await doSearch(currentQuery);
      if (currentQuery === query) {
        setActiveResponse(res);
      }
    }, 180);
    return () => clearTimeout(delayed);
  }, [query]);

  // Ensures the search results list shows the correct item.
  React.useEffect(() => {
    if (searchResultsRef.current) {
      const list = searchResultsRef.current;
      if (selectedIndex >= 0 && selectedIndex < list.children.length) {
        list.children[selectedIndex].scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [selectedIndex]);

  // Fire events when the user uses the up/down keys on the keyboard.
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!activeResponse) {
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(Math.max(selectedIndex - 1, -1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(
        Math.min(selectedIndex + 1, activeResponse.results.length - 1)
      );
    } else if (
      e.key === 'Enter' &&
      selectedIndex >= 0 &&
      selectedIndex < activeResponse.results.length
    ) {
      e.preventDefault();
      onClick(activeResponse.id, activeResponse.results[selectedIndex]);
    }
  };

  return (
    <Dialog
      open={shown}
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="relative bg-white rounded-lg mx-auto py-2 shadow-xl overflow-hidden sm:align-middle sm:max-w-lg sm:w-full sm:py-6">
          {/* Search Bar */}
          <div className="flex items-center justify-center px-2 sm:px-6">
            <div className="flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="ml-3 w-0 flex-1">
              <input
                className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 placeholder-gray-600 rounded-none leading-tight focus:outline-none text-lg"
                type="text"
                placeholder={searchPlaceholder ?? 'Search for something...'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                ref={searchInputRef}
                onFocus={() => setSelectedIndex(-1)}
              />
            </div>
          </div>
          {/* Search Results Area */}
          {/* This is a fixed-height box. */}
          {activeResponse && (
            <div
              className="mt-2 sm:mt-6 flex-1 overflow-y-auto max-h-96 scrollbar-hide max-w-full divide-y divide-gray-200"
              ref={searchResultsRef}
            >
              {activeResponse.results.map((result, i) => (
                <div
                  key={result.document}
                  className={`flex px-4 py-2 cursor-pointer ${
                    selectedIndex == i ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => onClick(activeResponse.id, result)}
                  onMouseEnter={() => {
                    setSelectedIndex(i);
                  }}
                >
                  {/* Main Content */}
                  <div className="flex-grow">
                    {/* Title */}
                    <h3 className="text-sm leading-5 text-gray-900 font-bold">
                      {result.properties.title ?? result.document}
                    </h3>
                    {/* Snippets */}
                    <div className="flex flex-col justify-between">
                      {result.snippets.map((snippet) => (
                        <p
                          key={snippet}
                          className="text-sm leading-5 text-gray-500"
                        >
                          {snippet}
                        </p>
                      ))}
                    </div>
                  </div>
                  {/* Right Arrow Icon */}
                  <div className="ml-4 flex-shrink-0 flex flex-col justify-center items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Dialog>
  );
};

// Props for the SearchBar component.
type Props = {
  apiKey: string;
  setId: string;
  children: React.ReactNode;
  feedback?: boolean;
  placeholderText?: string;
  keyboardShortcuts?: string[];
};

/**
 * The SearchBar component is a simple pre-built way of integrating
 * Operand Search into your application.
 */
const SearchBar: React.FC<Props> = ({
  apiKey,
  setId,
  children,
  feedback,
  placeholderText,
}) => {
  // Controls whether the search modal is shown.
  const [shown, setShown] = React.useState(false);

  // Executes a search.
  const doSearch = async (query: string) => {
    const response = await fetch('https://api.operand.ai/v1/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        sets: [setId],
        query: query,
        options: {
          filter: '',
          documents: 3,
          snippets: 2,
          rapid: false,
        },
      }),
    });
    if (response.ok) {
      return (await response.json()) as SearchResponse;
    } else {
      throw new Error(response.statusText);
    }
  };

  // Logs feedback to Operand about the result of a search.
  const logFeedback = async (searchId: string, documentId: string) => {
    const response = await fetch('https://api.operand.ai/v1/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify({
        search: {
          id: searchId,
          document: documentId,
        },
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
  };

  // Handles the case when a user clicks on a search result.
  const handleResultClick = async (searchId: string, result: SearchResult) => {
    if (feedback) {
      logFeedback(searchId, result.document);
    }
    setShown(false);
    if (result.properties.url) {
      window.location.href = result.properties.url;
    }
  };

  return (
    <>
      {/* The modal. */}
      <SearchModal
        shown={shown}
        searchPlaceholder={placeholderText}
        onClose={() => setShown(false)}
        doSearch={doSearch}
        onClick={handleResultClick}
      />
      {/* The content, e.g. a fake search bar. */}
      <div className="cursor-pointer" onClick={() => setShown(true)}>
        {children}
      </div>
    </>
  );
};

export { SearchBar, Props };
