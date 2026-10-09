export const loginWithGithub = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_LOCAL_URL}/auth/github`;
};
