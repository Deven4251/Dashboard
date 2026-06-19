export default function LoadingSpinner({ fullScreen = false, label = "Loading" }) {
  return (
    <div className={fullScreen ? "loading-screen" : "loading-inline"}>
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
