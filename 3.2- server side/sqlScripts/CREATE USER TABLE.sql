CREATE TABLE [dbo].[users](
	[user_id] [UNIQUEIDENTIFIER] PRIMARY KEY NOT NULL default NEWID(),
	[username] [varchar](30) NOT NULL UNIQUE,
	[password] [varchar](30) NOT NULL,
	[first_name] [varchar](50) NOT NULL,
	[last_name] [varchar](50) NOT NULL,
	[country] [varchar](50) NOT NULL,
	[email] [varchar](50) NOT NULL,
	[imageUrl] [varchar](300) NOT NULL
)

-- insert by calling "register" so the password is hashed
--INSERT INTO dbo.users VALUES (default, 'avitalze', '123456','avital','zehavi','Israel','avitalze57@gmail.com','url')
