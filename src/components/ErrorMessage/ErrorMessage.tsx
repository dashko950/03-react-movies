import styles from "./ErrorMessage.module.css";

interface ErrorMessageProps {
  message?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message = "There was an error, please try again...",
}) => {
  return <p className={styles.text}>{message}</p>;
};

export default ErrorMessage;
