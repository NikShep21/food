import React from "react";
import styles from "./User.module.scss";
import { RxAvatar } from "react-icons/rx";
import clsx from "clsx";
interface Props extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  avatar: string | null;

  className?: string;
  size?: number;
}
const User = ({ username, className, avatar, size = 40, ...props }: Props) => {
  return (
    <div className={clsx(styles.container, className)} {...props}>
      {avatar ? (
        <img
          src={avatar}
          alt="av"
          className={styles.avatar}
          style={{ width: size, height: size, borderRadius: "50%" }}
        />
      ) : (
        <RxAvatar size={size} />
      )}
      <p>{username}</p>
    </div>
  );
};

export default User;
