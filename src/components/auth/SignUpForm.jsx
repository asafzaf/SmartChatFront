// src/components/SignUpForm.jsx
import { useState } from 'react';
import FormButton from './FormButton';

function SignUpForm({ handleFlip, onSubmit, error }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    role: 'Student', // Default role
    preferences: {
      answerStyle: 'Concise',
      exampleCount: 'One',
      tone: 'Neutral'
    },
    expertiseLevel: 'Beginner'
  });
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic, 2: Profile, 3: Preferences

  const handleChange = (e) => {
    const { id, value } = e.target;
    
    // Handle nested preferences objects
    if (id.includes('.')) {
      const [parent, child] = id.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [id]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate based on current step
    if (currentStep === 1) {
      // Password validation
      if (formData.password !== formData.confirmPassword) {
        setValidationError('Passwords do not match');
        return;
      }
      
      if (formData.password.length < 6) {
        setValidationError('Password must be at least 6 characters');
        return;
      }
      
      // Move to profile step
      setValidationError('');
      setCurrentStep(2);
      return;
    }
    
    if (currentStep === 2) {
      // Move to preferences step
      setValidationError('');
      setCurrentStep(3);
      return;
    }
    
    // Submit complete form data (step 3)
    setValidationError('');
    setLoading(true);
    
    // Extract the data to match your mongoose model structure
    const userData = {
      email: formData.email,
      password: formData.password,
      first_name: formData.first_name,
      last_name: formData.last_name,
      role: formData.role,
      preferences: formData.preferences,
      expertiseLevel: formData.expertiseLevel
    };
    
    await onSubmit(userData);
    setLoading(false);
  };

  // Step back to previous form
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  // Render step headings
  const renderStepHeading = () => {
    switch (currentStep) {
      case 1:
        return <h3>Account Details</h3>;
      case 2:
        return <h3>Personal Information</h3>;
      case 3:
        return <h3>Preferences</h3>;
      default:
        return null;
    }
  };

  return (
    <>
      <h2>Sign Up</h2>
      {renderStepHeading()}
      <form onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {validationError && <div className="error-message">{validationError}</div>}
        
        {currentStep === 1 && (
          // Step 1: Basic form with email and password
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                type="password" 
                id="password" 
                placeholder="Create a password" 
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
          </>
        )}
        
        {currentStep === 2 && (
          // Step 2: Profile information
          <>
            <div className="form-group">
              <label htmlFor="first_name">First Name</label>
              <input 
                type="text" 
                id="first_name" 
                placeholder="Enter your first name" 
                value={formData.first_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input 
                type="text" 
                id="last_name" 
                placeholder="Enter your last name" 
                value={formData.last_name}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select 
                id="role" 
                value={formData.role}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select"
              >
                <option value="Student">Student</option>
                <option value="Lecturer">Lecturer</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="expertiseLevel">Expertise Level</label>
              <select 
                id="expertiseLevel" 
                value={formData.expertiseLevel}
                onChange={handleChange}
                required
                disabled={loading}
                className="form-select"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
          </>
        )}
        
        {currentStep === 3 && (
          // Step 3: Preferences
          <>
            <div className="form-group">
              <label htmlFor="preferences.answerStyle">Answer Style</label>
              <select 
                id="preferences.answerStyle" 
                value={formData.preferences.answerStyle}
                onChange={handleChange}
                disabled={loading}
                className="form-select"
              >
                <option value="Concise">Concise</option>
                <option value="Detailed">Detailed</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="preferences.exampleCount">Example Count</label>
              <select 
                id="preferences.exampleCount" 
                value={formData.preferences.exampleCount}
                onChange={handleChange}
                disabled={loading}
                className="form-select"
              >
                <option value="None">None</option>
                <option value="One">One</option>
                <option value="Two">Two</option>
                <option value="Multiple">Multiple</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="preferences.tone">Tone</label>
              <select 
                id="preferences.tone" 
                value={formData.preferences.tone}
                onChange={handleChange}
                disabled={loading}
                className="form-select"
              >
                <option value="Formal">Formal</option>
                <option value="Casual">Casual</option>
                <option value="Neutral">Neutral</option>
              </select>
            </div>
          </>
        )}
        
        <div className="form-buttons">
          {currentStep > 1 && (
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </button>
          )}
          
          <FormButton 
            text={
              loading ? "Signing Up..." : 
              currentStep < 3 ? "Next" : "Complete Sign Up"
            } 
            disabled={loading}
          />
        </div>
      </form>
      
      {currentStep === 1 && (
        <p>
          Already have an account?{' '}
          <button onClick={handleFlip} className="flip-btn" disabled={loading}>
            Sign In
          </button>
        </p>
      )}
    </>
  );
}

export default SignUpForm;