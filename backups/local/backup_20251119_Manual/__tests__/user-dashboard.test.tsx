import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import '@testing-library/jest-dom';

// Mock the auth hook
jest.mock('@/lib/auth', () => ({
  useAuth: jest.fn(),
  authService: {
    login: jest.fn(),
    logout: jest.fn(),
  },
}));

// Mock the database services
jest.mock('@/lib/database', () => ({
  learningPlanService: {
    getPlans: jest.fn(),
    createPlan: jest.fn(),
    updatePlan: jest.fn(),
    deletePlan: jest.fn(),
  },
  patentableIdeaService: {
    getIdeas: jest.fn(),
    createIdea: jest.fn(),
    updateIdea: jest.fn(),
    deleteIdea: jest.fn(),
  },
}));

// Mock the toast hook
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

// Import after mocking
import { useAuth } from '@/lib/auth';
import { learningPlanService, patentableIdeaService } from '@/lib/database';

describe('User Dashboard - Role-Based Access', () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Regular User Access', () => {
    const regularUser = {
      id: 'user-123',
      email: 'regular.user@actrec.gov.in',
      role: 'regular' as const,
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: regularUser,
        isAdmin: false,
        loading: false,
      });
    });

    it('should filter learning plans to show only user\'s own data', async () => {
      const mockPlans = [
        {
          email: 'regular.user@actrec.gov.in',
          title: 'User\'s Learning Plan',
          description: 'Personal development plan',
          category: 'Professional',
          status: 'in-progress' as const,
        },
        {
          email: 'admin@actrec.gov.in',
          title: 'Admin\'s Learning Plan',
          description: 'Admin development plan',
          category: 'Leadership',
          status: 'completed' as const,
        },
        {
          email: 'other.user@actrec.gov.in',
          title: 'Other User\'s Plan',
          description: 'Other development plan',
          category: 'Technical',
          status: 'not-started' as const,
        },
      ];

      (learningPlanService.getPlans as jest.Mock).mockResolvedValue({
        data: mockPlans,
        error: null,
      });

      // Import the component after mocking
      const { render, screen, waitFor } = await import('@testing-library/react');
      const SimpleLearningPlans = (await import('@/components/SimpleLearningPlans')).default;

      render(<SimpleLearningPlans />);

      await waitFor(() => {
        expect(learningPlanService.getPlans).toHaveBeenCalled();
      });

      // Should only show the user's own plan
      expect(screen.getByText("User's Learning Plan")).toBeInTheDocument();
      expect(screen.queryByText("Admin's Learning Plan")).not.toBeInTheDocument();
      expect(screen.queryByText("Other User's Plan")).not.toBeInTheDocument();
    });

    it('should filter patentable ideas to show only user\'s own data', async () => {
      const mockIdeas = [
        {
          email: 'regular.user@actrec.gov.in',
          title: 'User\'s Innovation',
          description: 'Personal patentable idea',
          category: 'Technology',
          status: 'draft' as const,
        },
        {
          email: 'admin@actrec.gov.in',
          title: 'Admin\'s Innovation',
          description: 'Admin patentable idea',
          category: 'Research',
          status: 'approved' as const,
        },
      ];

      (patentableIdeaService.getIdeas as jest.Mock).mockResolvedValue({
        data: mockIdeas,
        error: null,
      });

      // Import the component after mocking
      const { render, screen, waitFor } = await import('@testing-library/react');
      const SimplePatentableIdeas = (await import('@/components/SimplePatentableIdeas')).default;

      render(<SimplePatentableIdeas />);

      await waitFor(() => {
        expect(patentableIdeaService.getIdeas).toHaveBeenCalled();
      });

      // Should only show the user's own idea
      expect(screen.getByText("User's Innovation")).toBeInTheDocument();
      expect(screen.queryByText("Admin's Innovation")).not.toBeInTheDocument();
    });

    it('should create learning plans with user\'s email', async () => {
      (learningPlanService.createPlan as jest.Mock).mockResolvedValue({
        data: {
          email: 'regular.user@actrec.gov.in',
          title: 'New Learning Plan',
          description: 'Test plan',
          category: 'Test',
          status: 'not-started',
        },
        error: null,
      });

      const { render, screen, waitFor } = await import('@testing-library/react');
      const userEvent = (await import('@testing-library/user-event')).default;
      const SimpleLearningPlans = (await import('@/components/SimpleLearningPlans')).default;

      render(<SimpleLearningPlans />);

      // Fill out the form
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const addButton = screen.getByRole('button', { name: /add plan/i });

      await userEvent.type(titleInput, 'New Learning Plan');
      await userEvent.type(descriptionInput, 'Test plan description');
      await userEvent.type(categoryInput, 'Test Category');

      await userEvent.click(addButton);

      await waitFor(() => {
        expect(learningPlanService.createPlan).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'regular.user@actrec.gov.in',
            title: 'New Learning Plan',
            description: 'Test plan description',
            category: 'Test Category',
          })
        );
      });
    });

    it('should create patentable ideas with user\'s email', async () => {
      (patentableIdeaService.createIdea as jest.Mock).mockResolvedValue({
        data: {
          email: 'regular.user@actrec.gov.in',
          title: 'New Patentable Idea',
          description: 'Test idea',
          category: 'Test',
          status: 'draft',
        },
        error: null,
      });

      const { render, screen, waitFor } = await import('@testing-library/react');
      const userEvent = (await import('@testing-library/user-event')).default;
      const SimplePatentableIdeas = (await import('@/components/SimplePatentableIdeas')).default;

      render(<SimplePatentableIdeas />);

      // Fill out the form
      const titleInput = screen.getByLabelText(/title/i);
      const descriptionInput = screen.getByLabelText(/description/i);
      const categoryInput = screen.getByLabelText(/category/i);
      const addButton = screen.getByRole('button', { name: /add idea/i });

      await userEvent.type(titleInput, 'New Patentable Idea');
      await userEvent.type(descriptionInput, 'Test idea description');
      await userEvent.type(categoryInput, 'Test Category');

      await userEvent.click(addButton);

      await waitFor(() => {
        expect(patentableIdeaService.createIdea).toHaveBeenCalledWith(
          expect.objectContaining({
            email: 'regular.user@actrec.gov.in',
            title: 'New Patentable Idea',
            description: 'Test idea description',
            category: 'Test Category',
          })
        );
      });
    });
  });

  describe('Admin User Access', () => {
    const adminUser = {
      id: 'admin-123',
      email: 'admin@actrec.gov.in',
      role: 'admin' as const,
    };

    beforeEach(() => {
      mockUseAuth.mockReturnValue({
        user: adminUser,
        isAdmin: true,
        loading: false,
      });
    });

    it('should show all learning plans for admin users', async () => {
      const mockPlans = [
        {
          email: 'regular.user@actrec.gov.in',
          title: 'User\'s Learning Plan',
          description: 'Personal development plan',
          category: 'Professional',
          status: 'in-progress' as const,
        },
        {
          email: 'admin@actrec.gov.in',
          title: 'Admin\'s Learning Plan',
          description: 'Admin development plan',
          category: 'Leadership',
          status: 'completed' as const,
        },
      ];

      (learningPlanService.getPlans as jest.Mock).mockResolvedValue({
        data: mockPlans,
        error: null,
      });

      const { render, screen, waitFor } = await import('@testing-library/react');
      const SimpleLearningPlans = (await import('@/components/SimpleLearningPlans')).default;

      render(<SimpleLearningPlans />);

      await waitFor(() => {
        expect(learningPlanService.getPlans).toHaveBeenCalled();
      });

      // Admin should see all plans
      expect(screen.getByText("User's Learning Plan")).toBeInTheDocument();
      expect(screen.getByText("Admin's Learning Plan")).toBeInTheDocument();
    });

    it('should show all patentable ideas for admin users', async () => {
      const mockIdeas = [
        {
          email: 'regular.user@actrec.gov.in',
          title: 'User\'s Innovation',
          description: 'Personal patentable idea',
          category: 'Technology',
          status: 'draft' as const,
        },
        {
          email: 'admin@actrec.gov.in',
          title: 'Admin\'s Innovation',
          description: 'Admin patentable idea',
          category: 'Research',
          status: 'approved' as const,
        },
      ];

      (patentableIdeaService.getIdeas as jest.Mock).mockResolvedValue({
        data: mockIdeas,
        error: null,
      });

      const { render, screen, waitFor } = await import('@testing-library/react');
      const SimplePatentableIdeas = (await import('@/components/SimplePatentableIdeas')).default;

      render(<SimplePatentableIdeas />);

      await waitFor(() => {
        expect(patentableIdeaService.getIdeas).toHaveBeenCalled();
      });

      // Admin should see all ideas
      expect(screen.getByText("User's Innovation")).toBeInTheDocument();
      expect(screen.getByText("Admin's Innovation")).toBeInTheDocument();
    });
  });

  describe('Dashboard Tab Visibility', () => {
    it('should render all 4 tabs for regular users', async () => {
      const regularUser = {
        id: 'user-123',
        email: 'regular.user@actrec.gov.in',
        role: 'regular' as const,
      };

      mockUseAuth.mockReturnValue({
        user: regularUser,
        isAdmin: false,
        loading: false,
      });

      const { render, screen } = await import('@testing-library/react');
      const DashboardPage = (await import('@/app/dashboard/page')).default;

      render(<DashboardPage />);

      // Check that all 4 tabs are present
      expect(screen.getByRole('tab', { name: /learning plans/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /patentable ideas/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /search/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
    });
  });
});
