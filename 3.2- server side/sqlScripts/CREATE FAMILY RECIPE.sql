
CREATE TABLE [dbo].[favorite_recipes](
	[recipe_id] [varchar](255) NOT NULL,
	[author] [UNIQUEIDENTIFIER] NOT NULL,
	PRIMARY KEY (author, recipe_name),
	FOREIGN KEY (author) REFERENCES users(user_id)
)

CREATE TABLE [dbo].[last_watched_recipes](
	[recipe_id] [varchar](255) NOT NULL,
	[author] [UNIQUEIDENTIFIER] NOT NULL,
    [time] datetime NOT NULL default getdate(),
	PRIMARY KEY (author, recipe_id),
	FOREIGN KEY (author) REFERENCES users(user_id)
)

CREATE TABLE [dbo].[personal_recipes](
	[recipe_id] [varchar](300) NOT NULL, --example: familyrecipe1
	[author] [UNIQUEIDENTIFIER] NOT NULL,
	[title] [varchar](300) NOT NULL,
	[readyInMinutes] int NOT NULL,
    [vegetarian] BIT NOT NULL,
	[vegan] BIT NOT NULL,
    [glutenFree] BIT NOT NULL,
    [image] [varchar](300) NOT NULL,
	[servings] int NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY (author) REFERENCES users(user_id)
)
--INSERT INTO dbo.personal_recipes VALUES ('personalRecipe2','9cb0b315-df33-4659-b49e-5f88ef42f6ae', 'soup', 30,1,1,1,'soup url pic',5)

CREATE TABLE [dbo].[personal_recipes_instructions](
	[recipe_id] [varchar](300) NOT NULL, --example: personalrecipe1
	[step_num] int NOT NULL,
	[instruction] [varchar](600) NOT NULL,
	PRIMARY KEY (recipe_id,step_num),
	FOREIGN KEY (recipe_id) REFERENCES personal_recipes(recipe_id)
)

--INSERT INTO dbo.personal_recipes_instructions VALUES ('personalrecipe2',2, 'make dough')

CREATE TABLE [dbo].[personal_recipes_ingredients](
	[recipe_id] [varchar](300) NOT NULL, --example: personalrecipe1
	[index] int NOT NULL,
    [ingredient] [varchar](600) NOT NULL,
	PRIMARY KEY (recipe_id,[index]),
	FOREIGN KEY (recipe_id) REFERENCES personal_recipes(recipe_id)
)

--INSERT INTO dbo.personal_recipes_ingredients VALUES ('personalrecipe2',1, '3 mushrooms')


CREATE TABLE [dbo].[family_recipes](
	[recipe_id] [varchar](300) NOT NULL, --example: familyrecipe1
	[author] [UNIQUEIDENTIFIER] NOT NULL,
	[recipe_name] [varchar](300) NOT NULL,
	[family_member] [varchar](300) NOT NULL,
	[when_make] [varchar](300) NOT NULL,
	PRIMARY KEY (recipe_id),
	FOREIGN KEY (author) REFERENCES users(user_id)
)

--INSERT INTO dbo.family_recipes VALUES ('familyrecipe3', '9cb0b315-df33-4659-b49e-5f88ef42f6ae', 'kooba bamia','savta','all year','img')

CREATE TABLE [dbo].[family_recipes_instructions](
	[recipe_id] [varchar](300) NOT NULL, --example: familyrecipe1
	[instruction] [varchar](600) NOT NULL,
	[step_num] int NOT NULL,
	PRIMARY KEY (recipe_id,step_num),
	FOREIGN KEY (recipe_id) REFERENCES family_recipes(recipe_id)
)

--INSERT INTO dbo.family_recipes_instructions VALUES ('familyrecipe1', 'step3',3)

CREATE TABLE [dbo].[family_recipes_ingredients](
	[recipe_id] [varchar](300) NOT NULL, --example: familyrecipe1
	[ingredient] [varchar](600) NOT NULL,
	[index] int NOT NULL,
	PRIMARY KEY (recipe_id,[index]),
	FOREIGN KEY (recipe_id) REFERENCES family_recipes(recipe_id)
)
--INSERT INTO [dbo].[family_recipes_ingredients] VALUES ('familyrecipe2', 'meet',5)

--a68f25d9-5f28-49d3-9732-d465453ec2d1
