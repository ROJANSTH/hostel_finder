import RegisterForm from "../_components/RegisterForm";

export default function RegisterPage() {
    return (
        <div>
            <h1 className="mb-2 text-2xl font-semibold text-zinc-900">
                Create an account
            </h1>
            <p className="mb-6 text-sm text-zinc-600">
                Join Hostel Finder to discover great places to stay
            </p>
            <RegisterForm />
        </div>
    );
}
