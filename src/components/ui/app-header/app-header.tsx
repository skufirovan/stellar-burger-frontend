import React, { FC } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import styles from './app-header.module.css';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <>
          <BurgerIcon type={'primary'} />
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} text text_type_main-default ml-2 mr-10 ${isActive ? styles.link_active : ''}`
            }
          >
            Конструктор
          </NavLink>
        </>
        <>
          <ListIcon type={'primary'} />
          <NavLink
            to='feed'
            className={({ isActive }) =>
              `${styles.link} text text_type_main-default ml-2 mr-10 ${isActive ? styles.link_active : ''}`
            }
          >
            Лента заказов
          </NavLink>
        </>
      </div>
      <div className={styles.logo}>
        <Link to='/'>
          <Logo className='' />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        <ProfileIcon type={'primary'} />
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} text text_type_main-default ml-2 mr-10 ${isActive ? styles.link_active : ''}`
          }
        >
          {userName || 'Личный кабинет'}
        </NavLink>
      </div>
    </nav>
  </header>
);
