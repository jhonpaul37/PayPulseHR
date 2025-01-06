export default function ApplicationLogo(props) {
    return (
        <img
            {...props}
            src="/images/PayPulseHRWhite.png"
            alt="PayPulseHR Logo"
            className={`h-12 ${props.className || ''}`}
        />
    );
}
