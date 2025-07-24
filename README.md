npm i

***
Pada API /profile, terdapat hal yang harus di execute melalui SQL Editor
Dengan menambahkan 
```
ALTER TABLE "Users" 
ADD COLUMN profile_image VARCHAR(255)
```
```
UPDATE "Users" 
SET profile_image = 'https://yoururlapi.com/profile.jpeg'
WHERE id = 1
```

***
Pada API /balance, terdapat hal yang harus di execute melalui SQL Editor
Dengan menambahkan
```
ALTER TABLE "Users" 
ADD COLUMN balance INT
```
```
UPDATE "Users"
SET balance = 1000000
WHERE id = 1
```