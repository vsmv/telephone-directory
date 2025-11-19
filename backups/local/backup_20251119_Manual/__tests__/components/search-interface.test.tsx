import { render, screen, fireEvent } from '@testing-library/react';
import SearchInterface from '@/components/search-interface';
import { Contact } from '@/lib/types';

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

const mockContacts: Contact[] = [
  {
    id: '1',
    name: 'DR. PRASHANT BHAT',
    department: 'Medical Administration',
    designation: 'Doctor',
    phone_number: '-7671',
    extension: '5042',
    email: 'prashant.bhat@actrec.gov.in',
    location: 'Second Floor',
    institution: 'ACTREC',
    created_at: '2025-08-18T00:00:00Z',
    updated_at: '2025-08-18T00:00:00Z',
  },
];

describe('SearchInterface', () => {
  const mockSetSearchQuery = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input correctly', () => {
    render(
      <SearchInterface
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        contacts={[]}
        loading={false}
      />
    );

    expect(screen.getByPlaceholderText(/search by name, department/i)).toBeInTheDocument();
  });

  it('displays search results when contacts are provided', () => {
    render(
      <SearchInterface
        searchQuery="doctor"
        setSearchQuery={mockSetSearchQuery}
        contacts={mockContacts}
        loading={false}
      />
    );

    expect(screen.getByText('DR. PRASHANT BHAT')).toBeInTheDocument();
    expect(screen.getByText('Medical Administration')).toBeInTheDocument();
    expect(screen.getByText('prashant.bhat@actrec.gov.in')).toBeInTheDocument();
  });

  it('shows loading state when loading is true', () => {
    render(
      <SearchInterface
        searchQuery="test"
        setSearchQuery={mockSetSearchQuery}
        contacts={[]}
        loading={true}
      />
    );

    expect(screen.getByText('Searching...')).toBeInTheDocument();
  });

  it('shows no results message when search returns empty', () => {
    render(
      <SearchInterface
        searchQuery="nonexistent"
        setSearchQuery={mockSetSearchQuery}
        contacts={[]}
        loading={false}
      />
    );

    expect(screen.getByText('No contacts found')).toBeInTheDocument();
  });

  it('calls setSearchQuery when input changes', () => {
    render(
      <SearchInterface
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        contacts={[]}
        loading={false}
      />
    );

    const searchInput = screen.getByPlaceholderText(/search by name, department/i);
    fireEvent.change(searchInput, { target: { value: 'doctor' } });

    expect(mockSetSearchQuery).toHaveBeenCalledWith('doctor');
  });

  it('displays welcome message when no search query', () => {
    render(
      <SearchInterface
        searchQuery=""
        setSearchQuery={mockSetSearchQuery}
        contacts={[]}
        loading={false}
      />
    );

    expect(screen.getByText('Welcome to ACTREC Telephone Directory')).toBeInTheDocument();
    expect(screen.getByText(/search for contacts across departments/i)).toBeInTheDocument();
  });
});