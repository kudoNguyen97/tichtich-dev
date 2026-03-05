import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import {
    Form,
    Separator,
} from 'react-aria-components';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';
import { showSuccess } from '@/lib/toast';

const GoogleIcon = () => (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
        <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
        />
        <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
        />
        <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
        />
        <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
        />
    </svg>
);

export const Route = createFileRoute('/login')({
    component: LoginPage,
});

function LoginPage() {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<Record<string, string>>({});

    function validate() {
        const errs: Record<string, string> = {};
        if (!form.email) errs.email = t('auth.emailRequired');
        if (!form.password) errs.password = t('auth.passwordRequired');
        if (form.password && form.password.length < 8)
            errs.password = t('auth.passwordMin');
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const isValid = email.trim() !== '' && password.trim() !== '';

    const handleSubmit = async (e: any) => {
        if (!validate()) return;
        showSuccess('success.login');
        e.preventDefault();
        try {
             await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    const validateEmail = (value: string) => {
        const validEmail = value.trim().match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
        if (!validEmail) {
            return false;
        }
        return true;
    }

    const validatePassword = (value: string) => {
       if (!value && !value.trim()) {
        return false;
       }
       return true
    }

    return (
        <>
            <div className="mobile-container flex flex-col">
                <div className="bg-white rounded-2xl shadow-lg w-full  h-full min-h-screen">
                    <div className="w-full h-auto">
                        <img
                            src="/images/logo-login.svg"
                            alt="logo"
                            className="w-full h-auto object-contain"
                        />
                    </div>
                    <div className="flex justify-center items-center">
                        <img
                            src="/images/tichtich-text.svg"
                            alt="logo"
                            className=" object-contain"
                        />
                    </div>
                    <Form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 px-4 py-8"
                    >
                        {/* Email Field */}
                        <TichTichInput label="Email" placeholder="Nhập email của bạn" type="email" value={email} onChange={setEmail} errorMessage={errors.email} rightAdornment={<Mail color="#aaa" />}/>

                        {/* Password Field */}
                        <TichTichInput label="Mật khẩu" placeholder="Nhập mật khẩu của bạn" type="password" value={password} onChange={setPassword} errorMessage={errors.password} rightAdornment={<Eye color="#aaa" />}/>

                        {/* Forgot Password */}
                        <Link to="/register" className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 no-underline">
                            <span>Quên mật khẩu?</span>
                        </Link>

                        <TichTichButton type="submit" isDisabled={!isValid} variant="primary" size="md" fullWidth>Đăng nhập</TichTichButton>

                         <div className="text-center text-sm font-medium text-gray-500">
                            Chưa có tài khoản? &nbsp;<Link to="/register" className="font-medium text-tichtich-primary-200 hover:text-tichtich-primary-200/80 transition-colors duration-150 no-underline">Đăng ký tài khoản mới</Link>
                         </div>
                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <Separator className="flex-1 h-px bg-gray-200 border-none" />
                            <span className="text-xs text-gray-400 font-medium">
                                hoặc đăng nhập bằng
                            </span>
                            <Separator className="flex-1 h-px bg-gray-200 border-none" />
                        </div>

                        <div className="flex items-center justify-center gap-6">
                            <GoogleIcon />
                            <div className="w-[30px] h-[30px]">
                                <img src="/images/apple-logo.svg" alt="apple" className="w-full h-full object-contain" />
                            </div>
                        </div>
                    </Form>
                </div>
            </div>
        </>
    );
}
