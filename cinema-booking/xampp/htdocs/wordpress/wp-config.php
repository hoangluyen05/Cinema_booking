<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the website, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'movie_ticket' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost:3307' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'M{<UY_y*42gdi;F`Vp9PF2%:1J&oj%db%xgLwO$d?d+N4|E|c=!C3_uOo.y#<}+3' );
define( 'SECURE_AUTH_KEY',  'cR;Gg>U) j7SH^&I;N(g4W<#q}Wm=]Z<Hh3>%x[@jxb>lBfW?5uD;q08,+x#o$mP' );
define( 'LOGGED_IN_KEY',    'eyaaU/y{9%Q`2eJS}aQC`ln}Myi%HcYA7@z9Z*ac]*%#ln&V[7C:mN o&*^m?p3q' );
define( 'NONCE_KEY',        'Ug-SWae^s@v2Z3PMXPRpJL7uucJ9nkQE8>)u)EQ-ydy,{@{w1hq%gg]T9&L,M4Zy' );
define( 'AUTH_SALT',        'M[+|/z$R>F)k$gDBRzMu_ma-ENqMKrGTC<E)Ur+ qL,&{}d^coqImzJ>?4ME8M>i' );
define( 'SECURE_AUTH_SALT', 'L?-r?j!68:SDMX1FG+_B/XPpRf.s0t&QJQ|pZ{q% [|Q*p2;4M@s&{iIBCe;y$L~' );
define( 'LOGGED_IN_SALT',   'Y O6#BFYyJX-}!HY]^_k`uK,+wkz+r/5lVC8@$1)}X!MCI*8rPOH9)AR :L(LQ3U' );
define( 'NONCE_SALT',       'h1/>.>ZwPvLLtyniJd%&9DD.77ZA0kdHiN`Uy*?7x8ZGrV2(UKtd.^=4cVTqQE#=' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 *
 * At the installation time, database tables are created with the specified prefix.
 * Changing this value after WordPress is installed will make your site think
 * it has not been installed.
 *
 * @link https://developer.wordpress.org/advanced-administration/wordpress/wp-config/#table-prefix
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://developer.wordpress.org/advanced-administration/debug/debug-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
