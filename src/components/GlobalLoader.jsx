import { useLoader } from "../contexts/LoaderContext";

const BRAND = "JobLane";

const GlobalLoader = () => {
  const { loading } = useLoader();

  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="joblane-wave-loader">
        <h1>
          {BRAND.split("").map((char, index) => (
            <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              {char}
            </span>
          ))}
        </h1>

        <div className="career-line">
          <span></span>
        </div>

        <p>Shaping your career journey</p>
      </div>
    </div>
  );
};

export default GlobalLoader;
