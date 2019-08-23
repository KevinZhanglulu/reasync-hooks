import { default as React, useEffect } from "react";
import styles from "./notification.module.css";
import { Message, MessageType } from "../Message/Message";
import ReactDOM from "react-dom";
import { Transition } from "react-transition-group";

export type NotificationType = {
  id: number;
  title: string;
  type: MessageType;
  isShow: boolean;
};

type Notification = {
  notifications: NotificationType[];
  remove: (id: number) => void;
  close: (id: number) => void;
};

export const Notification = (props: Notification) => {
  const { notifications, remove, close } = props;
  let container = document.getElementById("notification-container");
  if (!container) {
    container = document.createElement("div");
    container.setAttribute("id", "notification-container");
    container.setAttribute("class", styles.container);
    document.body.prepend(container);
  }

  ReactDOM.render(
    notifications.map(notification => (
      <Transition
        appear={true}
        unmountOnExit={true}
        timeout={240}
        onExited={() => remove(notification.id)}
        in={notification.isShow}
        key={notification.id}
      >
        {state => (
          <div data-state={state} className={styles.animation}>
            <MessageWithDuration
              title={notification.title}
              duration={2}
              close={() => close(notification.id)}
              type={notification.type}
            />
          </div>
        )}
      </Transition>
    )),
    container as HTMLDivElement
  );
};

const MessageWithDuration = (props: {
  duration: number;
  title: string;
  close: Function;
  type: MessageType;
}) => {
  let closeTimer: NodeJS.Timeout | null;
  const startCloseTimer = () => {
    if (props.duration) {
      closeTimer = setTimeout(() => {
        props.close();
      }, props.duration * 1000);
    }
  };

  const clearCloseTimer = () => {
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
  };

  useEffect(() => {
    startCloseTimer();
    return clearCloseTimer;
  });

  return <Message title={props.title} type={props.type} />;
};
