// import AuthPage from '../../components/AuthPage';
// import LoadingSpinner from '../../components/LoadingSpinner';

// export default function SignUpPage() {
//   return <AuthPage mode="signup" />;
// }


import AuthPage from '../../components/AuthPage';
import AuthLayout from '../../components/AuthLayout';

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthPage mode="signup" />
    </AuthLayout>
  );
}