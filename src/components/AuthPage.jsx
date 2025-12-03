import React, { useState } from 'react';
import { TrendingUp, User, Lock, MapPin, BookOpen, School, UserCircle } from 'lucide-react';

// Added apiUrl prop to use the dynamic URL
const AuthPage = ({ onLogin, apiUrl }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    email: '', password: '', name: '', age: '',
    place: '', gender: 'Male', studentClass: '', collegeName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Use the dynamic apiUrl prop
    const baseURL = apiUrl || 'http://localhost:5000/api/auth';
    const endpoint = isLogin ? `${baseURL}/login` : `${baseURL}/signup`;
    
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      onLogin(data.token, data.user);
      
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex flex-col">
        
        <div className="p-8 text-center bg-blue-600">
          <h1 className="text-3xl font-extrabold text-white flex items-center justify-center gap-2">
            <TrendingUp size={32} className="text-white"/> TargetFlow
          </h1>
          <p className="text-blue-100 mt-2">
            {isLogin ? 'Welcome back! Login to continue.' : 'Create your student profile.'}
          </p>
        </div>

        <div className="p-8 overflow-y-auto max-h-[70vh]">
          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300 p-3 rounded-lg text-sm mb-6 text-center border border-rose-100 dark:border-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18}/>
                    <input required name="name" type="text" placeholder="John Doe" onChange={handleChange}
                      className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Age</label>
                    <input required name="age" type="number" placeholder="20" onChange={handleChange}
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none" />
                   </div>
                   <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Gender</label>
                    <select name="gender" onChange={handleChange} className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none">
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                   </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Place / City</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 text-slate-400" size={18}/>
                    <input required name="place" type="text" placeholder="New York" onChange={handleChange}
                      className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Class / Year</label>
                    <div className="relative">
                      <BookOpen className="absolute left-3 top-3 text-slate-400" size={18}/>
                      <input required name="studentClass" type="text" placeholder="B.Tech 3rd Yr" onChange={handleChange}
                        className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">College</label>
                    <div className="relative">
                      <School className="absolute left-3 top-3 text-slate-400" size={18}/>
                      <input required name="collegeName" type="text" placeholder="IIT Bombay" onChange={handleChange}
                        className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white outline-none" />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Email Address</label>
              <div className="relative">
                <UserCircle className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input required name="email" type="email" placeholder="you@example.com" onChange={handleChange}
                  className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-slate-400" size={18}/>
                <input required name="password" type="password" placeholder="••••••••" onChange={handleChange}
                  className="w-full pl-10 p-2.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-4">
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Create Account')}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline"
            >
              {isLogin ? "New user? Create an account" : "Already have an account? Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;