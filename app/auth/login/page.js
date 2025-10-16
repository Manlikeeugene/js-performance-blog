// import AuthPage from '../../components/AuthPage';
// import AuthLayout from '../../components/AuthLayout';
// import LoadingSpinner from '../../components/LoadingSpinner';

// export default function LoginPage() {
//   return <AuthPage mode="login" />;
// }

// app/auth/login/page.js
import AuthPage from '../../components/AuthPage';
import AuthLayout from '../../components/AuthLayout';

export default function LoginPage() {
  return (
    <AuthLayout>
      <AuthPage mode="login" />
    </AuthLayout>
  );
}