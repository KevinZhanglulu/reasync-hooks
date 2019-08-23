import React, { useRef } from "react";
import styles from "./message.module.css";
import { IconName, Size } from "../Icon/icon_contants";
import classNames from "classnames";
import { Icon } from "../Icon/Icon";

export type MessageType = "Error" | "Success" | "Warning";

type MessageProps = {
  title: string;
  className?: string;
  type?: MessageType;
};

const Message = (props: MessageProps) => {
  const { title, type = "Info", className } = props;
  const ref = useRef(null);

  const iconCls = classNames(styles.icon, {
    [styles.info]: type === "Info",
    [styles.waring]: type === "Warning",
    [styles.error]: type === "Error",
    [styles.success]: type === "Success"
  });
  const iconName =
    type === "Info"
      ? IconName.INFO
      : type === "Error"
      ? IconName.ERROR
      : type === "Success"
      ? IconName.SUCCESS
      : type === "Warning"
      ? IconName.WARNING
      : "";

  const cls = classNames(styles.message, className);

  return (
    <div className={cls} ref={ref}>
      {IconName && (
        <div className={styles.iconContainer}>
          <Icon className={iconCls} iconName={iconName} size={Size.SIZE20} />
        </div>
      )}
      <div className={styles.popup}>
        <span>{title}</span>
      </div>
    </div>
  );
};

const MessageMemo = React.memo(Message);

export { MessageMemo as Message };
