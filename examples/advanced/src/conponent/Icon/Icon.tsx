import React from "react";
import styles from "./icon.module.css";
import classNames from "classnames";
import { Size } from "./icon_contants";

type IconProps = {
  iconName: string;
  isLoading?: boolean;
  size?: string;
  className?: string;
};
const Icon = (props: IconProps) => {
  const { isLoading = false, size = Size.DEFAULT, iconName, className } = props;
  const cls = classNames(styles.icon, styles[size], className, {
    [styles.iconLoading]: isLoading
  });
  return (
    <svg className={cls} aria-hidden="true">
      <use href={`#icon-${iconName}`} />
    </svg>
  );
};

const IconMemo = React.memo(Icon);

export { IconMemo as Icon };
