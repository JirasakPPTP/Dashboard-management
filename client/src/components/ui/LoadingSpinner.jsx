const LoadingSpinner = ({ fullScreen = false }) => (
  <div className={`${fullScreen ? "min-h-screen" : "py-10"} flex items-center justify-center`}>
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
  </div>
);

export default LoadingSpinner;
