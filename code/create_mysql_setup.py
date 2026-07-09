import mysql.connector
from mysql.connector import errorcode


def create_database_and_user(
    root_host="localhost",
    root_user="root",
    root_password="your_root_password",
    database_name="airflow_airlines",
    app_user="airflow",
    app_password="YourStrongPassword"
):
    try:
        conn = mysql.connector.connect(
            host=root_host,
            user=root_user,
            password=root_password,
        )
        cursor = conn.cursor()

        cursor.execute(
            f"CREATE DATABASE IF NOT EXISTS `{database_name}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
        )
        print(f"✅ Database '{database_name}' created or already exists.")

        cursor.execute(
            f"CREATE USER IF NOT EXISTS '{app_user}'@'localhost' IDENTIFIED BY '{app_password}';"
        )
        cursor.execute(
            f"GRANT ALL PRIVILEGES ON `{database_name}`.* TO '{app_user}'@'localhost';"
        )
        cursor.execute("FLUSH PRIVILEGES;")

        print(f"✅ MySQL user '{app_user}' created/updated and granted privileges on '{database_name}'.")

    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print("❌ Access denied: check your root username/password.")
        elif err.errno == errorcode.ER_BAD_DB_ERROR:
            print(f"❌ Database '{database_name}' does not exist and could not be created.")
        else:
            print(f"❌ MySQL error: {err}")
    finally:
        if 'cursor' in locals():
            cursor.close()
        if 'conn' in locals() and conn.is_connected():
            conn.close()


if __name__ == '__main__':
    create_database_and_user()
