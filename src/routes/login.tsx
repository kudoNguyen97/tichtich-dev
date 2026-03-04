import { createFileRoute, Link, redirect } from '@tanstack/react-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import {
    TextField,
    Label,
    Input,
    Button,
    Form,
    Separator,
} from 'react-aria-components';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';
import { TichTichButton } from '@/components/common/TichTichButton';
import { TichTichInput } from '@/components/common/TichTichInput';

const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
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

const UserPlusIcon = () => (
    <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <line x1="19" y1="8" x2="19" y2="14" />
        <line x1="22" y1="11" x2="16" y2="11" />
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
        e.preventDefault();
        try {
             await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.log((error as Error).message);
        }
    }

    return (
        <>
            <div className="mobile-container flex flex-col">
                <div className="bg-white rounded-2xl shadow-lg w-full  h-full min-h-screen">
                    <div>
                        <img
                            src="/images/logo-login.svg"
                            alt="logo"
                            className="w-full object-contain"
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
                        <TextField
                            value={email}
                            onChange={setEmail}
                            type="email"
                            autoComplete="email"
                            className="flex flex-col gap-1.5"
                        >
                            <Label className="text-sm font-semibold text-gray-900">
                                Địa chỉ Email
                            </Label>
                            <div className="relative flex items-center">
                                <Input
                                    placeholder="Nhập email của bạn"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-sm text-gray-900 placeholder:text-gray-300 bg-white outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/10 transition-all duration-200"
                                />
                                <span className="absolute right-3.5 pointer-events-none flex items-center">
                                    <Mail color="#aaa" />
                                </span>
                            </div>
                        </TextField>

                        {/* Password Field */}
                        <TextField
                            value={password}
                            onChange={setPassword}
                            type={showPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            className="flex flex-col gap-1.5"
                        >
                            <Label className="text-sm font-semibold text-gray-900">
                                Mật khẩu
                            </Label>
                            <div className="relative flex items-center">
                                <Input
                                    placeholder="Nhập mật khẩu của bạn"
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3.5 pr-11 text-sm text-gray-900 placeholder:text-gray-300 bg-white outline-none focus:border-gray-800 focus:ring-2 focus:ring-gray-800/10 transition-all duration-200"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    aria-label={
                                        showPassword
                                            ? 'Ẩn mật khẩu'
                                            : 'Hiện mật khẩu'
                                    }
                                    className="absolute right-3.5 flex items-center cursor-pointer bg-transparent border-none p-1 rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-gray-800"
                                >
                                    {showPassword ? (
                                        <Eye color="#aaa" />
                                    ) : (
                                        <EyeOff color="#aaa" />
                                    )}
                                </button>
                            </div>
                        </TextField>

                        {/* Forgot Password */}
                        <div className="-mt-1">
                            <a
                                href="#"
                                className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 no-underline"
                            >
                                Quên mật khẩu?
                            </a>
                        </div>

                        {/* Login Button */}
                        <Button
                            type="submit"
                            isDisabled={!isValid}
                            className={`mt-1 w-full py-3.5 rounded-full text-sm font-semibold transition-all duration-200 border-none cursor-pointer
                ${
                    isValid
                        ? 'bg-gray-900 text-white hover:bg-gray-700 active:scale-[0.98]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                        >
                            Đăng nhập
                        </Button>

                        {/* Create Account Button */}
                        <Button
                            type="button"
                            onPress={() =>
                                alert('Chuyển tới trang tạo tài khoản')
                            }
                            className="w-full py-3.5 rounded-full border border-gray-900 bg-white text-gray-900 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer"
                        >
                            <UserPlusIcon />
                            <span>Tạo tài khoản</span>
                        </Button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <Separator className="flex-1 h-px bg-gray-200 border-none" />
                            <span className="text-xs text-gray-400 font-medium">
                                hoặc
                            </span>
                            <Separator className="flex-1 h-px bg-gray-200 border-none" />
                        </div>

                        <TichTichInput label="Email" placeholder="Nhập email của bạn" type="email" rightAdornment={<Mail color="#aaa" />}/>

                        {/* Google Login Button */}
                        <TichTichButton type="button" onPress={() => alert('Đăng nhập bằng Google')} variant="primary" isDisabled size="md" fullWidth leftIcon={<GoogleIcon />} rightIcon={<span>Đăng nhập bằng Google</span>} />
                    </Form>
                </div>
            </div>
        </>
    );
}
