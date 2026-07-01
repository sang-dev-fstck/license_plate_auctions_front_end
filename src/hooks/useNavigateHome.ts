import { useNavigate } from 'react-router-dom'

/**
 * Custom hook to navigate to home page based on user role
 */
export const useNavigateHome = () => {
  const navigate = useNavigate()

  const getHomePath = (): string => {
    return "/login";
  }

  const navigateToHome = () => {
    navigate(getHomePath())
  }

  return {
    navigateToHome,
    getHomePath,
  }
}
