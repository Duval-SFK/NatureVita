import { Link } from 'react-router-dom';

const CallToAction = ({ title, buttonText, buttonLink }) => {
  return (
    <section className="bg-primary py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          {title}
        </h2>
        <Link 
          to={buttonLink} 
          className="inline-block bg-secondary text-dark px-8 py-3 rounded-md text-lg font-medium hover:bg-opacity-90 transition-all transform hover:scale-105"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;