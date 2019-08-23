import React from "react";
import styles from "./button.module.css";
import { Icon } from "../Icon/Icon";
import { IconName } from "../Icon/icon_contants";
import classNames from "classnames";
import { BUTTON_SIZE } from "./button_contants";

type ButtonProps = {
  className?: string;

  isBorder?: boolean;
  isDisabled?: boolean;
  isPrimary?: boolean;
  isLoading?: boolean;
  isDanger?: boolean;

  iconName?: string;
  iconClassName?: string;
  iconSize?: string;

  onClick?: React.MouseEventHandler<HTMLButtonElement>;

  children?: React.ReactNode;

  size?: string;

  isLink?: boolean;

  buttonRef?: React.RefObject<HTMLButtonElement>;
  [key: string]: any;
};

export const Button = (props: ButtonProps) => {
  const {
    className,
    iconName,
    isDisabled,
    children,
    iconSize = "",
    iconClassName,
    onClick,
    isPrimary,
    isLoading,
    size = BUTTON_SIZE.default,
    isBorder = false,
    isLink = false,
    isDanger = false,
    buttonRef,
    ...restProps
  } = props;

  const buttonCls = classNames(
    styles.button,
    className,
    styles[size],

    {
      [styles.primary]: isPrimary,
      [styles.loading]: isLoading && isPrimary,
      [styles.border]: isBorder,
      [styles.link]: isLink,
      [styles.danger]: isDanger
    }
  );

  const iconCls = classNames(iconClassName, {
    [styles.icon]: (children && iconName) || isLoading
  });
  return (
    <button
      disabled={isDisabled}
      onClick={onClick}
      className={buttonCls}
      ref={buttonRef}
      {...restProps}
    >
      <span>
        {iconName && (
          <span className={iconCls}>
            <Icon iconName={iconName} size={iconSize} />
          </span>
        )}
        {isLoading && isPrimary && (
          <span className={iconCls}>
            <Icon iconName={IconName.LOADING} isLoading={true} />
          </span>
        )}
        {children && <span>{children}</span>}
      </span>
    </button>
  );
};

/*const ButtonMemo = React.memo(Button);

export { ButtonMemo as Button };*/
