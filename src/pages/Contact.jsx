import { useState, useContext } from 'react';
import { LanguageContext } from '../context/LanguageContext';
import { FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi';

const Contact = () => {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);

  const translations = {
    fr: {
      title: 'Contactez-Nous',
      subtitle: 'Nous sommes là pour vous aider',
      info: {
        address: {
          title: 'Notre Adresse',
          content: 'Cocody Angré, Tradex Logpom, Douala, Cameroun'
        },
        phone: {
          title: 'Téléphone',
          content: '+237 678 36 38 71'
        },
        email: {
          title: 'Email',
          content: 'contact@naturevita.cm'
        },
        hours: {
          title: 'Heures d\'Ouverture',
          content: 'Lun - Ven: 8h00 - 18h00\nSam: 9h00 - 15h00'
        }
      },
      form: {
        title: 'Envoyez-nous un message',
        name: 'Nom complet',
        email: 'Adresse email',
        subject: 'Sujet',
        message: 'Votre message',
        submit: 'Envoyer le message',
        success: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.',
        error: 'Une erreur s\'est produite. Veuillez réessayer plus tard.'
      },
      placeholders: {
        name: 'Entrez votre nom complet',
        email: 'Entrez votre adresse email',
        subject: 'Quel est le sujet de votre message?',
        message: 'Écrivez votre message ici...'
      },
      validation: {
        required: 'Ce champ est requis',
        invalidEmail: 'Veuillez entrer une adresse email valide'
      },
      followUs: 'Suivez-nous sur les réseaux sociaux'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'We are here to help you',
      info: {
        address: {
          title: 'Our Address',
          content: 'Cocody Angré, 7th Block, Abidjan, Ivory Coast'
        },
        phone: {
          title: 'Phone',
          content: '+225 07 07 07 07 07'
        },
        email: {
          title: 'Email',
          content: 'contact@naturevita.ci'
        },
        hours: {
          title: 'Opening Hours',
          content: 'Mon - Fri: 8:00 AM - 6:00 PM\nSat: 9:00 AM - 3:00 PM'
        }
      },
      form: {
        title: 'Send us a message',
        name: 'Full name',
        email: 'Email address',
        subject: 'Subject',
        message: 'Your message',
        submit: 'Send message',
        success: 'Your message has been sent successfully. We will get back to you as soon as possible.',
        error: 'An error occurred. Please try again later.'
      },
      placeholders: {
        name: 'Enter your full name',
        email: 'Enter your email address',
        subject: 'What is the subject of your message?',
        message: 'Write your message here...'
      },
      validation: {
        required: 'This field is required',
        invalidEmail: 'Please enter a valid email address'
      },
      followUs: 'Follow us on social media'
    }
  };

  const t = translations[language];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setFormStatus({ type: 'error', message: t.validation.required });
      return;
    }
    
    if (!validateEmail(formData.email)) {
      setFormStatus({ type: 'error', message: t.validation.invalidEmail });
      return;
    }
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ type: 'success', message: t.form.success });
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // Reset form status after 5 seconds
      setTimeout(() => {
        setFormStatus(null);
      }, 5000);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Hero Section */}
      <section className="bg-primary text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">{t.title}</h1>
          <p className="text-xl opacity-90">{t.subtitle}</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">{t.info.address.title}</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMapPin className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t.info.address.title}</h3>
                    <p className="text-gray-600 mt-1">{t.info.address.content}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiPhone className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t.info.phone.title}</h3>
                    <p className="text-gray-600 mt-1">{t.info.phone.content}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiMail className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t.info.email.title}</h3>
                    <p className="text-gray-600 mt-1">{t.info.email.content}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-primary/10 p-3 rounded-full mr-4">
                    <FiClock className="text-primary text-xl" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{t.info.hours.title}</h3>
                    <p className="text-gray-600 mt-1 whitespace-pre-line">{t.info.hours.content}</p>
                  </div>
                </div>
              </div>
              
              {/* Map Placeholder */}
              <div className="mt-8 bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <p className="text-gray-500">Google Maps Integration</p>
              </div>
              
              {/* Social Media */}
              <div className="mt-8">
                <h3 className="font-medium text-gray-900 mb-4">{t.followUs}</h3>
                <div className="flex space-x-4">
                  <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="bg-primary/10 p-3 rounded-full hover:bg-primary/20 transition-colors">
                    <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-primary mb-6">{t.form.title}</h2>
              
              {formStatus && (
                <div className={`p-4 mb-6 rounded-md ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {formStatus.message}
                </div>
              )}
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    {t.form.name} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={t.placeholders.name}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                    {t.form.email} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={t.placeholders.email}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                    {t.form.subject} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={t.placeholders.subject}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                    {t.form.message} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={t.placeholders.message}
                    rows="5"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="flex items-center justify-center w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary-dark transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <FiSend className="mr-2" />
                  {t.form.submit}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;