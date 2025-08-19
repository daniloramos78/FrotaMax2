import React, { useState } from 'react';

const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C42.012,36.494,44,30.836,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

const MailIcon = ({className}:{className?:string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const LockIcon = ({className}:{className?:string}) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const FrotaOKLogo = () => (
    <div className="flex flex-col items-center justify-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex flex-col items-center justify-center p-2 shadow-inner">
        <svg className="w-12 h-12 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H3.375m15.75 9V14.25a3.375 3.375 0 00-3.375-3.375h-1.5a1.125 1.125 0 00-1.125 1.125v1.5a3.375 3.375 0 003.375 3.375h1.5m-15.75-9a3.375 3.375 0 00-3.375 3.375V14.25" />
        </svg>
        <span className="text-xs font-bold text-gray-600 mt-1">FrotaOK</span>
      </div>
    </div>
  );

interface LoginPageProps {
    onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('daniloramos78@gmail.com');
    const [password, setPassword] = useState('••••••••••');
    const [error, setError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        // For demo, allow login with displayed email/any password, or admin credentials
        if ((email === 'daniloramos78@gmail.com' && password.length > 0) || (email === 'admin@fleetflow.com' && password === 'password')) {
            onLogin();
        } else {
            setError('Credenciais inválidas. Tente com os dados da imagem ou use admin@fleetflow.com / password.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md space-y-6 transform transition-all duration-300">
                <div className="flex justify-center">
                    <FrotaOKLogo />
                </div>
                
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Bem-vindo ao FrotaOK</h1>
                    <p className="text-gray-500 mt-2">Entre para continuar</p>
                </div>

                <button className="flex items-center justify-center w-full py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    <GoogleIcon />
                    Continuar com o Google
                </button>

                <div className="flex items-center text-gray-400 text-sm">
                    <hr className="flex-grow border-gray-200" />
                    <span className="mx-4 font-semibold">OU</span>
                    <hr className="flex-grow border-gray-200" />
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">E-mail</label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                               <MailIcon className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full py-3 pl-10 pr-4 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                required
                            />
                        </div>
                    </div>
                    <div>
                         <label htmlFor="password"  className="block text-sm font-medium text-gray-700 mb-2">Senha</label>
                         <div className="relative">
                             <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                                <LockIcon className="h-5 w-5 text-gray-400" />
                            </span>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-3 pl-10 pr-4 bg-gray-100 border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                required
                            />
                         </div>
                    </div>
                    
                     {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full py-3 mt-2 bg-gray-800 text-white font-bold rounded-lg hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800">
                        Entrar
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    <a href="#" className="hover:underline">Esqueceu sua senha?</a>
                    <span className="mx-2">·</span>
                    <span>Precisa de uma conta? <a href="#" className="font-semibold text-gray-800 hover:underline">Cadastre-se</a></span>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
