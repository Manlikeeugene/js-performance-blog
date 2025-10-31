import AuthPage from '../../components/AuthPage';
import AuthLayout from '../../components/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthPage mode="login" />
    </AuthLayout>
  );
}