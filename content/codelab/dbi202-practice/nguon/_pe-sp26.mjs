/**
 * DBscript.sql của ba đề PE DBI202 SP26 thật (content/exams/DBI202-PE1..3, bản gốc trong Given.zip của đề):
 *   PE_HR / PE_HR_TSQL       — Đề 1 (SP26-1, CSDL nhân sự Regions/Countries/Locations/Jobs/Departments/Employees)
 *   PE_MUSIC / PE_MUSIC_TSQL — Đề 2 + Đề 3 (SP26 Paper 1 / Paper 8, CSDL nhạc Artists/Albums/Genres/Tracks/Users/Playlists/PlaylistTracks)
 * *_TSQL = nguyên văn từ CREATE TABLE đầu tiên (giữ IDENTITY, SET IDENTITY_INSERT, GO) — setup.sql của đề chạy trên SQL Server.
 * Bản không hậu tố = làm gọn cho máy chấm trình duyệt (bỏ GO/[]/IDENTITY/IDENTITY_INSERT, FOREIGN KEY REFERENCES → REFERENCES,
 * DEFAULT GETDATE() → DEFAULT CURRENT_TIMESTAMP, thêm dấu ;) bằng scratchpad sach.mjs — dữ liệu giữ nguyên từng dòng.
 */
export const PE_HR = String.raw`
CREATE TABLE Regions(
	RegionID int NOT NULL primary key,
	RegionName varchar(30) NULL
);
CREATE TABLE Countries(
	CountryID varchar(10) NOT NULL primary key,
	CountryName varchar(50) NULL,
	RegionID int NOT NULL REFERENCES Regions (RegionID)
);
CREATE TABLE Locations(
	LocationID varchar(5) NOT NULL primary key,
	StreetAddress varchar(100) NULL,
	PostalCode varchar(20) NULL,
	City varchar(30) NULL,
	StateProvince varchar(30) NULL,
	CountryID varchar(10) NOT NULL REFERENCES Countries (CountryID)
);
CREATE TABLE Jobs(
	JobID varchar(20) NOT NULL primary key,
	JobTitle varchar(100) NULL,
	min_salary int NULL,
	max_salary int NULL
);
CREATE TABLE Departments(
	DepartmentID int NOT NULL primary key,
	DepartmentName varchar(50) NULL,
	LocationID varchar(5) NULL REFERENCES Locations (LocationID),
    ManagerID INT NULL
);
CREATE TABLE Employees(
	EmployeeID int NOT NULL primary key,
	FirstName varchar(30) NULL,
	LastName varchar(30) NULL,
	Email varchar(50) NULL,
	Phone varchar(20) NULL,
	HireDate date NULL,
	JobID varchar (20) NOT NULL REFERENCES Jobs (JobID),
	Salary float NULL,
	Commission_pct float NULL,
	ManagerID int NULL REFERENCES Employees (EmployeeID),
    DepartmentID int NOT NULL REFERENCES Departments (DepartmentID)
);
INSERT INTO Regions (RegionID, RegionName) VALUES (1, N'Europe');
INSERT INTO Regions (RegionID, RegionName) VALUES (2, N'Americas');
INSERT INTO Regions (RegionID, RegionName) VALUES (3, N'Asia');
INSERT INTO Regions (RegionID, RegionName) VALUES (4, N'Middle East and Africa');
INSERT INTO Regions (RegionID, RegionName) VALUES (5, N'Africa');
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'AR', N'Argentina', 2);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'AU', N'Australia', 3);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'BE', N'Belgium', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'BR', N'Brazil', 2);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'CA', N'Canada', 2);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'CH', N'Switzerland', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'CN', N'China', 3);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'DE', N'Germany', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'DK', N'Denmark', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'EG', N'Egypt', 4);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'FR', N'France', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'HK', N'HongKong', 3);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'IL', N'Israel', 4);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'IN', N'India', 3);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'IT', N'Italy', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'JP', N'Japan', 3);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'KW', N'Kuwait', 4);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'MX', N'Mexico', 2);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'NG', N'Nigeria', 4);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'NL', N'Netherlands', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'SG', N'Singapore', 3);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'UK', N'United Kingdom', 1);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'US', N'United States of America', 2);
INSERT INTO Countries (CountryID, CountryName, RegionID) VALUES (N'VN', N'Vietnam', 3);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'AC_ACCOUNT', N'Public Accountant', 4200, 9000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'AC_MGR', N'Accounting Manager', 8200, 16000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'AD_ASST', N'Administration Assistant', 3000, 6000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'AD_PRES', N'President', 20000, 40000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'AD_VP', N'Administration Vice President', 15000, 30000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'FI_ACCOUNT', N'Accountant', 4200, 9000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'FI_MGR', N'Finance Manager', 8200, 16000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'HR_REP', N'Human Resources Representative', 4000, 9000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'IT_PROG', N'Programmer', 4000, 10000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'MK_MAN', N'Marketing Manager', 9000, 15000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'MK_REP', N'Marketing Representative', 4000, 9000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'PU_CLERK', N'Purchasing Clerk', 2500, 5500);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'PU_MAN', N'Purchasing Manager', 8000, 15000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'SA_MAN', N'Sales Manager', 10000, 20000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'SA_REP', N'Sales Representative', 6000, 12000);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'SH_CLERK', N'Shipping Clerk', 2500, 5500);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'ST_MAN', N'Shipper ', 3000, 6500);
INSERT INTO Jobs (JobID, JobTitle, min_salary, max_salary) VALUES (N'ST_CLERK', N'Shipper Clerk', 2500, 4500);
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1100', N'93091 Calle della Testa', N'10934', N'Venice', NULL, N'IT');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1200', N'2017 Shinjuku-ku', N'1689', N'Tokyo', N'Tokyo Prefecture', N'JP');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1300', N'9450 Kamiya-cho', N'6823', N'Hiroshima', NULL, N'JP');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1400', N'2014 Jabberwocky Rd', N'26192', N'Southlake', N'Texas', N'US');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1500', N'2011 Interiors Blvd', N'99236', N'South San Francisco', N'California', N'US');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1600', N'2007 Zagora St', N'50090', N'South Brunswick', N'New Jersey', N'US');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1700', N'2004 Charade Rd', N'98199', N'Seattle', N'Washington', N'US');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'1800', N'147 Spadina Ave', N'M5V 2L7', N'Toronto', N'Ontario', N'CA');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2000', N'40-5-12 Laogianggen', N'190518', N'Beijing', NULL, N'CN');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2200', N'12-98 Victoria Street', N'2901', N'Sydney', N'New South Wales', N'AU');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2300', N'198 Clementi North', N'540198', N'Singapore', NULL, N'SG');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2400', N'8204 Arthur St', NULL, N'London', NULL, N'UK');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2500', N'Magdalen Centre', N'OX9 9ZB', N'The Oxford', N'Oxford', N'UK');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2600', N'9702 Chester Road', N'9629850293', N'Stretford', N'Manchester', N'UK');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2700', N'Schwanthalerstr. 7031', N'80925', N'Munich', N'Bavaria', N'DE');
INSERT INTO Locations (LocationID, StreetAddress, PostalCode, City, StateProvince, CountryID) VALUES (N'2900', N'20 Rue des Corps-Saints', N'1730', N'Geneva', N'Geneve', N'CH');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (10, N'Administration', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (20, N'Marketing', NULL, N'1800');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (30, N'Purchasing', 114, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (40, N'Human Resources', NULL, N'2400');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (50, N'Shipping', 121, N'1500');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (60, N'IT', 103, N'1400');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (70, N'Public Relations', NULL, N'2700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (80, N'Sales', 145, N'2500');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (90, N'Executive', 100, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (100, N'Finance', 108, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (110, N'Accounting', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (120, N'Treasury', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (130, N'Corporate Tax', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (140, N'Control And Credit', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (150, N'Shareholder Services', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (160, N'Benefits', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (170, N'Manufacturing', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (180, N'Construction', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (190, N'Contracting', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (200, N'Operations', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (210, N'IT Support', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (220, N'NOC', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (230, N'IT Helpdesk', NULL, N'1700');
INSERT INTO Departments (DepartmentID, DepartmentName, ManagerID, LocationID) VALUES (240, N'Government Sales', NULL, N'1700');
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (100, N'Steven', N'King', N'SKING', N'515.123.4567', CAST(N'2003-06-17' AS Date), N'AD_PRES', 24000, 0, NULL, 90);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (101, N'Neena', N'Kochhar', N'NKOCHHAR', N'515.123.4568', CAST(N'2005-09-21' AS Date), N'AD_VP', 17000, 0, 100, 90);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (102, N'Lex', N'De Haan', N'LDEHAAN', N'515.123.4569', CAST(N'2001-01-13' AS Date), N'AD_VP', 17000, 0, 100, 90);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (103, N'Alexander', N'Hunold', N'AHUNOLD', N'590.423.4567', CAST(N'2006-01-03' AS Date), N'IT_PROG', 9000, 0, 102, 60);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (104, N'Bruce', N'Ernst', N'BERNST', N'590.423.4568', CAST(N'2007-05-21' AS Date), N'IT_PROG', 6000, 0, 103, 60);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (105, N'David', N'Austin', N'DAUSTIN', N'590.423.4569', CAST(N'2005-06-25' AS Date), N'IT_PROG', 4800, 0, 103, 60);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (106, N'Valli', N'Pataballa', N'VPATABAL', N'590.423.4560', CAST(N'2006-02-05' AS Date), N'IT_PROG', 4800, 0, 103, 60);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (107, N'Diana', N'Lorentz', N'DLORENTZ', N'590.423.5567', CAST(N'2007-02-07' AS Date), N'IT_PROG', 4200, 0, 103, 60);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (108, N'Nancy', N'Greenberg', N'NGREENBE', N'515.124.4569', CAST(N'2002-08-17' AS Date), N'FI_MGR', 12000, 0, 101, 100);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (109, N'Daniel', N'Faviet', N'DFAVIET', N'515.124.4169', CAST(N'2002-08-16' AS Date), N'FI_ACCOUNT', 9000, 0, 108, 100);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (110, N'John', N'Chen', N'JCHEN', N'515.124.4269', CAST(N'2005-09-28' AS Date), N'FI_ACCOUNT', 8200, 0, 108, 100);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (111, N'Ismael', N'Sciarra', N'ISCIARRA', N'515.124.4369', CAST(N'2005-09-30' AS Date), N'FI_ACCOUNT', 7700, 0, 108, 100);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (112, N'Jose', N'Manuel	Urman', N'JMURMAN', N'515.124.4469', CAST(N'2006-03-07' AS Date), N'FI_ACCOUNT', 7800, 0, 108, 100);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (113, N'Luis', N'Popp', N'LPOPP', N'515.124.4567', CAST(N'2007-12-07' AS Date), N'FI_ACCOUNT', 6900, 0, 108, 100);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (114, N'Den', N'Raphaely', N'DRAPHEAL', N'515.127.4561', CAST(N'2002-12-07' AS Date), N'PU_MAN', 11000, 0, 100, 30);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (115, N'Alexander', N'Khoo', N'AKHOO', N'515.127.4562', CAST(N'2003-05-18' AS Date), N'PU_CLERK', 3100, 0, 114, 30);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (116, N'Shelli', N'Baida', N'SBAIDA', N'515.127.4563', CAST(N'2005-12-24' AS Date), N'PU_CLERK', 2900, 0, 114, 30);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (117, N'Sigal', N'Tobias', N'STOBIAS', N'515.127.4564', CAST(N'2005-07-24' AS Date), N'PU_CLERK', 2800, 0, 114, 30);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (118, N'Guy', N'Himuro', N'GHIMURO', N'515.127.4565', CAST(N'2006-11-15' AS Date), N'PU_CLERK', 2600, 0, 114, 30);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (119, N'Karen', N'Colmenares', N'KCOLMENA', N'515.127.4566', CAST(N'2007-08-10' AS Date), N'PU_CLERK', 2500, 0, 114, 30);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (120, N'Matthew', N'Weiss', N'MWEISS', N'650.123.1234', CAST(N'2004-07-18' AS Date), N'ST_MAN', 8000, 0, 100, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (121, N'Adam', N'Fripp', N'AFRIPP', N'650.123.2234', CAST(N'2005-04-10' AS Date), N'ST_MAN', 8200, 0, 100, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (122, N'Payam', N'Kaufling', N'PKAUFLIN', N'650.123.3234', CAST(N'2003-05-01' AS Date), N'ST_MAN', 7900, 0, 100, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (123, N'Shanta', N'Vollman', N'SVOLLMAN', N'650.123.4234', CAST(N'2005-10-10' AS Date), N'ST_MAN', 6500, 0, 100, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (124, N'Kevin', N'Mourgos', N'KMOURGOS', N'650.123.5234', CAST(N'2007-11-16' AS Date), N'ST_MAN', 5800, 0, 100, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (125, N'Julia', N'Nayer', N'JNAYER', N'650.124.1214', CAST(N'2005-07-16' AS Date), N'ST_CLERK', 3200, 0, 120, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (126, N'Irene', N'Mikkilineni', N'IMIKKILI', N'650.124.1224', CAST(N'2006-09-28' AS Date), N'ST_CLERK', 2700, 0, 120, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (127, N'James', N'Landry', N'JLANDRY', N'650.124.1334', CAST(N'2007-01-14' AS Date), N'ST_CLERK', 2400, 0, 120, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (128, N'Steven', N'Markle', N'SMARKLE', N'650.124.1434', CAST(N'2008-03-08' AS Date), N'ST_CLERK', 2200, 0, 120, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (129, N'Laura', N'Bissot', N'LBISSOT', N'650.124.5234', CAST(N'2005-08-20' AS Date), N'ST_CLERK', 3300, 0, 121, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (130, N'Mozhe', N'Atkinson', N'MATKINSO', N'650.124.6234', CAST(N'2005-10-30' AS Date), N'ST_CLERK', 2800, 0, 121, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (131, N'James', N'Marlow', N'JAMRLOW', N'650.124.7234', CAST(N'2005-02-16' AS Date), N'ST_CLERK', 2500, 0, 121, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (132, N'TJ', N'Olson', N'TJOLSON', N'650.124.8234', CAST(N'2007-04-10' AS Date), N'ST_CLERK', 2100, 0, 121, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (133, N'Jason', N'Mallin', N'JMALLIN', N'6.501.271.934', CAST(N'2004-06-14' AS Date), N'ST_CLERK', 3300, 0, 122, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (134, N'Michael', N'Rogers', N'MROGERS', N'6.501.271.834', CAST(N'2006-08-26' AS Date), N'ST_CLERK', 2900, 0, 122, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (135, N'Ki', N'Gee', N'KGEE', N'6.501.271.734', CAST(N'2007-12-12' AS Date), N'ST_CLERK', 2400, 0, 122, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (136, N'Hazel', N'Philtanker', N'HPHILTAN', N'6.501.271.634', CAST(N'2008-06-02' AS Date), N'ST_CLERK', 2200, 0, 122, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (137, N'Renske', N'Ladwig', N'RLADWIG', N'6.501.211.234', CAST(N'2003-07-14' AS Date), N'ST_CLERK', 3600, 0, 123, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (138, N'Stephen', N'Stiles', N'SSTILES', N'6.501.212.034', CAST(N'2005-10-26' AS Date), N'ST_CLERK', 3200, 0, 123, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (139, N'John', N'Seo', N'JSEO', N'6.501.212.019', CAST(N'2006-02-12' AS Date), N'ST_CLERK', 2700, 0, 123, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (140, N'Joshua', N'Patel', N'JPATEL', N'6.501.211.834', CAST(N'2006-04-06' AS Date), N'ST_CLERK', 2500, 0, 123, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (141, N'Trenna', N'Rajs', N'TRAJS', N'6.501.218.009', CAST(N'2003-10-17' AS Date), N'ST_CLERK', 3500, 0, 124, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (142, N'Curtis', N'Davies', N'CDAVIES', N'6.501.212.994', CAST(N'2005-05-19' AS Date), N'ST_CLERK', 3100, 0, 124, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (143, N'Randall', N'Matos', N'RMATOS', N'6.501.212.874', CAST(N'2006-03-15' AS Date), N'ST_CLERK', 2600, 0, 124, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (144, N'Peter', N'Vargas', N'PVARGAS', N'6.501.212.004', CAST(N'2006-07-09' AS Date), N'ST_CLERK', 2500, 0, 124, 50);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (145, N'John', N'Russell', N'JRUSSEL', N'011.44.1344.429268', CAST(N'2004-10-01' AS Date), N'SA_MAN', 14000, 0.4, 100, 80);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (146, N'Karen', N'Partners', N'KPARTNER', N'011.44.1344.467268', CAST(N'2005-01-05' AS Date), N'SA_MAN', 13500, 0.3, 100, 80);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (147, N'Alberto', N'Errazuriz', N'AERRAZUR', N'011.44.1344.429278', CAST(N'2005-03-10' AS Date), N'SA_MAN', 12000, 0.3, 100, 80);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (148, N'Gerald', N'Cambrault', N'GCAMBRAU', N'011.44.1344.619268', CAST(N'2007-10-15' AS Date), N'SA_MAN', 11000, 0.3, 100, 80);
INSERT INTO Employees (EmployeeID, FirstName, LastName, Email, Phone, HireDate, JobID, Salary, Commission_pct, ManagerID, DepartmentID) VALUES (149, N'Eleni', N'Zlotkey', N'EZLOTKEY', N'011.44.1344.429018', CAST(N'2008-01-29' AS Date), N'SA_MAN', 10500, 0.2, 100, 80);
`;
export const PE_HR_TSQL = String.raw`
CREATE TABLE [dbo].[Regions](
	[RegionID] [int] NOT NULL primary key,
	[RegionName] [varchar](30) NULL
) 
GO
CREATE TABLE [dbo].[Countries](
	[CountryID] [varchar](10) NOT NULL primary key,
	[CountryName] [varchar](50) NULL,
	[RegionID] [int] NOT NULL REFERENCES [dbo].[Regions] ([RegionID])
)
GO
CREATE TABLE [dbo].[Locations](
	[LocationID] [varchar](5) NOT NULL primary key,
	[StreetAddress] [varchar](100) NULL,
	[PostalCode] [varchar](20) NULL,
	[City] [varchar](30) NULL,
	[StateProvince] [varchar](30) NULL,
	[CountryID] [varchar](10) NOT NULL REFERENCES [dbo].[Countries] ([CountryID])
)
GO
CREATE TABLE [dbo].[Jobs](
	[JobID] [varchar](20) NOT NULL primary key,
	[JobTitle] [varchar](100) NULL,
	[min_salary] [int] NULL,
	[max_salary] [int] NULL,
)
GO
CREATE TABLE [dbo].[Departments](
	[DepartmentID] [int] NOT NULL primary key,
	[DepartmentName] [varchar](50) NULL,
	[LocationID] [varchar](5) NULL REFERENCES [dbo].[Locations] ([LocationID]),
    [ManagerID] [INT] NULL 
) 
GO
CREATE TABLE [dbo].[Employees](
	[EmployeeID] [int] NOT NULL primary key,
	[FirstName] [varchar](30) NULL,
	[LastName] [varchar](30) NULL,
	[Email] [varchar](50) NULL,
	[Phone] [varchar](20) NULL,
	[HireDate] [date] NULL,
	[JobID] [varchar] (20) NOT NULL REFERENCES [dbo].[Jobs] ([JobID]),
	[Salary] [float] NULL,
	[Commission_pct] [float] NULL,
	[ManagerID] [int] NULL REFERENCES [dbo].[Employees] ([EmployeeID]),
    [DepartmentID] [int] NOT NULL REFERENCES [dbo].[Departments] ([DepartmentID])
) 
GO
INSERT [dbo].[Regions] ([RegionID], [RegionName]) VALUES (1, N'Europe')
INSERT [dbo].[Regions] ([RegionID], [RegionName]) VALUES (2, N'Americas')
INSERT [dbo].[Regions] ([RegionID], [RegionName]) VALUES (3, N'Asia')
INSERT [dbo].[Regions] ([RegionID], [RegionName]) VALUES (4, N'Middle East and Africa')
INSERT [dbo].[Regions] ([RegionID], [RegionName]) VALUES (5, N'Africa')
GO
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'AR', N'Argentina', 2)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'AU', N'Australia', 3)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'BE', N'Belgium', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'BR', N'Brazil', 2)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'CA', N'Canada', 2)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'CH', N'Switzerland', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'CN', N'China', 3)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'DE', N'Germany', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'DK', N'Denmark', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'EG', N'Egypt', 4)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'FR', N'France', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'HK', N'HongKong', 3)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'IL', N'Israel', 4)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'IN', N'India', 3)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'IT', N'Italy', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'JP', N'Japan', 3)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'KW', N'Kuwait', 4)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'MX', N'Mexico', 2)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'NG', N'Nigeria', 4)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'NL', N'Netherlands', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'SG', N'Singapore', 3)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'UK', N'United Kingdom', 1)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'US', N'United States of America', 2)
INSERT [dbo].[Countries] ([CountryID], [CountryName], [RegionID]) VALUES (N'VN', N'Vietnam', 3)
GO
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'AC_ACCOUNT', N'Public Accountant', 4200, 9000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'AC_MGR', N'Accounting Manager', 8200, 16000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'AD_ASST', N'Administration Assistant', 3000, 6000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'AD_PRES', N'President', 20000, 40000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'AD_VP', N'Administration Vice President', 15000, 30000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'FI_ACCOUNT', N'Accountant', 4200, 9000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'FI_MGR', N'Finance Manager', 8200, 16000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'HR_REP', N'Human Resources Representative', 4000, 9000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'IT_PROG', N'Programmer', 4000, 10000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'MK_MAN', N'Marketing Manager', 9000, 15000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'MK_REP', N'Marketing Representative', 4000, 9000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'PU_CLERK', N'Purchasing Clerk', 2500, 5500)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'PU_MAN', N'Purchasing Manager', 8000, 15000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'SA_MAN', N'Sales Manager', 10000, 20000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'SA_REP', N'Sales Representative', 6000, 12000)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'SH_CLERK', N'Shipping Clerk', 2500, 5500)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'ST_MAN', N'Shipper ', 3000, 6500)
INSERT [dbo].[Jobs] ([JobID], [JobTitle], [min_salary], [max_salary]) VALUES (N'ST_CLERK', N'Shipper Clerk', 2500, 4500)
GO
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1100', N'93091 Calle della Testa', N'10934', N'Venice', NULL, N'IT')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1200', N'2017 Shinjuku-ku', N'1689', N'Tokyo', N'Tokyo Prefecture', N'JP')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1300', N'9450 Kamiya-cho', N'6823', N'Hiroshima', NULL, N'JP')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1400', N'2014 Jabberwocky Rd', N'26192', N'Southlake', N'Texas', N'US')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1500', N'2011 Interiors Blvd', N'99236', N'South San Francisco', N'California', N'US')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1600', N'2007 Zagora St', N'50090', N'South Brunswick', N'New Jersey', N'US')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1700', N'2004 Charade Rd', N'98199', N'Seattle', N'Washington', N'US')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'1800', N'147 Spadina Ave', N'M5V 2L7', N'Toronto', N'Ontario', N'CA')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2000', N'40-5-12 Laogianggen', N'190518', N'Beijing', NULL, N'CN')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2200', N'12-98 Victoria Street', N'2901', N'Sydney', N'New South Wales', N'AU')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2300', N'198 Clementi North', N'540198', N'Singapore', NULL, N'SG')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2400', N'8204 Arthur St', NULL, N'London', NULL, N'UK')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2500', N'Magdalen Centre', N'OX9 9ZB', N'The Oxford', N'Oxford', N'UK')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2600', N'9702 Chester Road', N'9629850293', N'Stretford', N'Manchester', N'UK')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2700', N'Schwanthalerstr. 7031', N'80925', N'Munich', N'Bavaria', N'DE')
INSERT [dbo].[Locations] ([LocationID], [StreetAddress], [PostalCode], [City], [StateProvince], [CountryID]) VALUES (N'2900', N'20 Rue des Corps-Saints', N'1730', N'Geneva', N'Geneve', N'CH')
GO
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (10, N'Administration', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (20, N'Marketing', NULL, N'1800')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (30, N'Purchasing', 114, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (40, N'Human Resources', NULL, N'2400')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (50, N'Shipping', 121, N'1500')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (60, N'IT', 103, N'1400')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (70, N'Public Relations', NULL, N'2700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (80, N'Sales', 145, N'2500')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (90, N'Executive', 100, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (100, N'Finance', 108, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (110, N'Accounting', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (120, N'Treasury', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (130, N'Corporate Tax', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (140, N'Control And Credit', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (150, N'Shareholder Services', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (160, N'Benefits', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (170, N'Manufacturing', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (180, N'Construction', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (190, N'Contracting', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (200, N'Operations', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (210, N'IT Support', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (220, N'NOC', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (230, N'IT Helpdesk', NULL, N'1700')
INSERT [dbo].[Departments] ([DepartmentID], [DepartmentName], [ManagerID], [LocationID]) VALUES (240, N'Government Sales', NULL, N'1700')
GO
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (100, N'Steven', N'King', N'SKING', N'515.123.4567', CAST(N'2003-06-17' AS Date), N'AD_PRES', 24000, 0, NULL, 90)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (101, N'Neena', N'Kochhar', N'NKOCHHAR', N'515.123.4568', CAST(N'2005-09-21' AS Date), N'AD_VP', 17000, 0, 100, 90)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (102, N'Lex', N'De Haan', N'LDEHAAN', N'515.123.4569', CAST(N'2001-01-13' AS Date), N'AD_VP', 17000, 0, 100, 90)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (103, N'Alexander', N'Hunold', N'AHUNOLD', N'590.423.4567', CAST(N'2006-01-03' AS Date), N'IT_PROG', 9000, 0, 102, 60)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (104, N'Bruce', N'Ernst', N'BERNST', N'590.423.4568', CAST(N'2007-05-21' AS Date), N'IT_PROG', 6000, 0, 103, 60)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (105, N'David', N'Austin', N'DAUSTIN', N'590.423.4569', CAST(N'2005-06-25' AS Date), N'IT_PROG', 4800, 0, 103, 60)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (106, N'Valli', N'Pataballa', N'VPATABAL', N'590.423.4560', CAST(N'2006-02-05' AS Date), N'IT_PROG', 4800, 0, 103, 60)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (107, N'Diana', N'Lorentz', N'DLORENTZ', N'590.423.5567', CAST(N'2007-02-07' AS Date), N'IT_PROG', 4200, 0, 103, 60)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (108, N'Nancy', N'Greenberg', N'NGREENBE', N'515.124.4569', CAST(N'2002-08-17' AS Date), N'FI_MGR', 12000, 0, 101, 100)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (109, N'Daniel', N'Faviet', N'DFAVIET', N'515.124.4169', CAST(N'2002-08-16' AS Date), N'FI_ACCOUNT', 9000, 0, 108, 100)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (110, N'John', N'Chen', N'JCHEN', N'515.124.4269', CAST(N'2005-09-28' AS Date), N'FI_ACCOUNT', 8200, 0, 108, 100)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (111, N'Ismael', N'Sciarra', N'ISCIARRA', N'515.124.4369', CAST(N'2005-09-30' AS Date), N'FI_ACCOUNT', 7700, 0, 108, 100)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (112, N'Jose', N'Manuel	Urman', N'JMURMAN', N'515.124.4469', CAST(N'2006-03-07' AS Date), N'FI_ACCOUNT', 7800, 0, 108, 100)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (113, N'Luis', N'Popp', N'LPOPP', N'515.124.4567', CAST(N'2007-12-07' AS Date), N'FI_ACCOUNT', 6900, 0, 108, 100)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (114, N'Den', N'Raphaely', N'DRAPHEAL', N'515.127.4561', CAST(N'2002-12-07' AS Date), N'PU_MAN', 11000, 0, 100, 30)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (115, N'Alexander', N'Khoo', N'AKHOO', N'515.127.4562', CAST(N'2003-05-18' AS Date), N'PU_CLERK', 3100, 0, 114, 30)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (116, N'Shelli', N'Baida', N'SBAIDA', N'515.127.4563', CAST(N'2005-12-24' AS Date), N'PU_CLERK', 2900, 0, 114, 30)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (117, N'Sigal', N'Tobias', N'STOBIAS', N'515.127.4564', CAST(N'2005-07-24' AS Date), N'PU_CLERK', 2800, 0, 114, 30)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (118, N'Guy', N'Himuro', N'GHIMURO', N'515.127.4565', CAST(N'2006-11-15' AS Date), N'PU_CLERK', 2600, 0, 114, 30)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (119, N'Karen', N'Colmenares', N'KCOLMENA', N'515.127.4566', CAST(N'2007-08-10' AS Date), N'PU_CLERK', 2500, 0, 114, 30)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (120, N'Matthew', N'Weiss', N'MWEISS', N'650.123.1234', CAST(N'2004-07-18' AS Date), N'ST_MAN', 8000, 0, 100, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (121, N'Adam', N'Fripp', N'AFRIPP', N'650.123.2234', CAST(N'2005-04-10' AS Date), N'ST_MAN', 8200, 0, 100, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (122, N'Payam', N'Kaufling', N'PKAUFLIN', N'650.123.3234', CAST(N'2003-05-01' AS Date), N'ST_MAN', 7900, 0, 100, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (123, N'Shanta', N'Vollman', N'SVOLLMAN', N'650.123.4234', CAST(N'2005-10-10' AS Date), N'ST_MAN', 6500, 0, 100, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (124, N'Kevin', N'Mourgos', N'KMOURGOS', N'650.123.5234', CAST(N'2007-11-16' AS Date), N'ST_MAN', 5800, 0, 100, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (125, N'Julia', N'Nayer', N'JNAYER', N'650.124.1214', CAST(N'2005-07-16' AS Date), N'ST_CLERK', 3200, 0, 120, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (126, N'Irene', N'Mikkilineni', N'IMIKKILI', N'650.124.1224', CAST(N'2006-09-28' AS Date), N'ST_CLERK', 2700, 0, 120, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (127, N'James', N'Landry', N'JLANDRY', N'650.124.1334', CAST(N'2007-01-14' AS Date), N'ST_CLERK', 2400, 0, 120, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (128, N'Steven', N'Markle', N'SMARKLE', N'650.124.1434', CAST(N'2008-03-08' AS Date), N'ST_CLERK', 2200, 0, 120, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (129, N'Laura', N'Bissot', N'LBISSOT', N'650.124.5234', CAST(N'2005-08-20' AS Date), N'ST_CLERK', 3300, 0, 121, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (130, N'Mozhe', N'Atkinson', N'MATKINSO', N'650.124.6234', CAST(N'2005-10-30' AS Date), N'ST_CLERK', 2800, 0, 121, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (131, N'James', N'Marlow', N'JAMRLOW', N'650.124.7234', CAST(N'2005-02-16' AS Date), N'ST_CLERK', 2500, 0, 121, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (132, N'TJ', N'Olson', N'TJOLSON', N'650.124.8234', CAST(N'2007-04-10' AS Date), N'ST_CLERK', 2100, 0, 121, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (133, N'Jason', N'Mallin', N'JMALLIN', N'6.501.271.934', CAST(N'2004-06-14' AS Date), N'ST_CLERK', 3300, 0, 122, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (134, N'Michael', N'Rogers', N'MROGERS', N'6.501.271.834', CAST(N'2006-08-26' AS Date), N'ST_CLERK', 2900, 0, 122, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (135, N'Ki', N'Gee', N'KGEE', N'6.501.271.734', CAST(N'2007-12-12' AS Date), N'ST_CLERK', 2400, 0, 122, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (136, N'Hazel', N'Philtanker', N'HPHILTAN', N'6.501.271.634', CAST(N'2008-06-02' AS Date), N'ST_CLERK', 2200, 0, 122, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (137, N'Renske', N'Ladwig', N'RLADWIG', N'6.501.211.234', CAST(N'2003-07-14' AS Date), N'ST_CLERK', 3600, 0, 123, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (138, N'Stephen', N'Stiles', N'SSTILES', N'6.501.212.034', CAST(N'2005-10-26' AS Date), N'ST_CLERK', 3200, 0, 123, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (139, N'John', N'Seo', N'JSEO', N'6.501.212.019', CAST(N'2006-02-12' AS Date), N'ST_CLERK', 2700, 0, 123, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (140, N'Joshua', N'Patel', N'JPATEL', N'6.501.211.834', CAST(N'2006-04-06' AS Date), N'ST_CLERK', 2500, 0, 123, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (141, N'Trenna', N'Rajs', N'TRAJS', N'6.501.218.009', CAST(N'2003-10-17' AS Date), N'ST_CLERK', 3500, 0, 124, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (142, N'Curtis', N'Davies', N'CDAVIES', N'6.501.212.994', CAST(N'2005-05-19' AS Date), N'ST_CLERK', 3100, 0, 124, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (143, N'Randall', N'Matos', N'RMATOS', N'6.501.212.874', CAST(N'2006-03-15' AS Date), N'ST_CLERK', 2600, 0, 124, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (144, N'Peter', N'Vargas', N'PVARGAS', N'6.501.212.004', CAST(N'2006-07-09' AS Date), N'ST_CLERK', 2500, 0, 124, 50)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (145, N'John', N'Russell', N'JRUSSEL', N'011.44.1344.429268', CAST(N'2004-10-01' AS Date), N'SA_MAN', 14000, 0.4, 100, 80)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (146, N'Karen', N'Partners', N'KPARTNER', N'011.44.1344.467268', CAST(N'2005-01-05' AS Date), N'SA_MAN', 13500, 0.3, 100, 80)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (147, N'Alberto', N'Errazuriz', N'AERRAZUR', N'011.44.1344.429278', CAST(N'2005-03-10' AS Date), N'SA_MAN', 12000, 0.3, 100, 80)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (148, N'Gerald', N'Cambrault', N'GCAMBRAU', N'011.44.1344.619268', CAST(N'2007-10-15' AS Date), N'SA_MAN', 11000, 0.3, 100, 80)
INSERT [dbo].[Employees] ([EmployeeID], [FirstName], [LastName], [Email], [Phone], [HireDate], [JobID], [Salary], [Commission_pct], [ManagerID], [DepartmentID]) VALUES (149, N'Eleni', N'Zlotkey', N'EZLOTKEY', N'011.44.1344.429018', CAST(N'2008-01-29' AS Date), N'SA_MAN', 10500, 0.2, 100, 80)
GO
`;
export const PE_MUSIC = String.raw`
CREATE TABLE Artists (
    ID INT PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
	Gender nvarchar(20),
    Country NVARCHAR(50),
    Birthdate date
);

-- 2. Albums Table
CREATE TABLE Albums (
    ID INT PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    ReleaseYear INT CHECK (ReleaseYear > 1900),
    ArtistID INT REFERENCES Artists(ID)
);

-- 3. Genres Table
CREATE TABLE Genres (
    ID INT PRIMARY KEY,
    Name NVARCHAR(50) UNIQUE NOT NULL
);

-- 4. Tracks Table
CREATE TABLE Tracks (
    ID INT PRIMARY KEY,
    Title NVARCHAR(200) NOT NULL,
    Duration INT NOT NULL, -- Duration in seconds
	Language nvarchar(100),
    AlbumID INT REFERENCES Albums(ID),
    GenreID INT REFERENCES Genres(ID)
);

-- 5. Users Table
CREATE TABLE Users (
    ID INT PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    SubscriptionType NVARCHAR(20) DEFAULT 'Free' CHECK (SubscriptionType IN ('Free', 'Premium')),
    RegistrationDate DATE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Playlists Table
CREATE TABLE Playlists (
    ID INT PRIMARY KEY,
    Title NVARCHAR(100) NOT NULL,
    UserID INT REFERENCES Users(ID),
    CreatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 7. PlaylistTracks
CREATE TABLE PlaylistTracks (
    PlaylistID INT REFERENCES Playlists(ID),
    TrackID INT REFERENCES Tracks(ID),
    AddedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (PlaylistID, TrackID)
);

----------------- INSERT INTO data ----------------------
-- Artists
INSERT INTO Artists (ID, Name, Gender, Country, Birthdate) VALUES
(1,  'Taylor Swift',        'Female', 'USA',        '1989-12-13'),
(2,  'Ed Sheeran',          'Male',   'UK',         '1991-02-17'),
(3,  'Adele',               'Female', 'UK',         '1988-05-05'),
(4,  'Drake',               'Male',   'Canada',     '1986-10-24'),
(5,  'BTS',                 'Group',  'South Korea','2013-06-13'),
(6,  'Billie Eilish',       'Female', 'USA',        '2001-12-18'),
(7,  'Bruno Mars',          'Male',   'USA',        '1985-10-08'),
(8,  'Blackpink',           'Group',  'South Korea','2016-08-08'),
(9,  'The Weeknd',          'Male',   'Canada',     '1990-02-16'),
(10, 'Ariana Grande',       'Female', 'USA',        '1993-06-26'),
(11, 'Coldplay',            'Group',  'UK',         '1996-01-16'),
(12, 'Imagine Dragons',     'Group',  'USA',        '2008-01-01'),
(13, 'Shawn Mendes',        'Male',   'Canada',     '1998-08-08'),
(14, 'Justin Bieber',       'Male',   'Canada',     '1994-03-01'),
(15, 'IU',                  'Female', 'South Korea','1993-05-16'),
(16, 'Charlie Puth',        'Male',   'USA',        '1991-12-02'),
(17, 'Maroon 5',            'Group',  'USA',        '1994-01-01'),
(18, 'Rihanna',             'Female', 'Barbados',   '1988-02-20'),
(19, 'Eminem',              'Male',   'USA',        '1972-10-17'),
(20, 'Lady Gaga',           'Female', 'USA',        '1986-03-28'),
(21, 'Sam Smith',           'Male',   'UK',         '1992-05-19'),
(22, 'Dua Lipa',            'Female', 'UK',         '1995-08-22'),
(23, 'Post Malone',         'Male',   'USA',        '1995-07-04'),
(24, 'SZA',                 'Female', 'USA',        '1989-11-08'),
(25, 'Kendrick Lamar',      'Male',   'USA',        '1987-06-17'),
(26, 'Harry Styles',        'Male',   'UK',         '1994-02-01'),
(27, 'Selena Gomez',        'Female', 'USA',        '1992-07-22'),
(28, 'Red Velvet',          'Group',  'South Korea','2014-08-01'),
(29, 'G-Dragon',            'Male',   'South Korea','1988-08-18'),
(30, 'Alicia Keys',         'Female', 'USA',        '1981-01-25');

-- Albums

INSERT INTO Albums (ID, Title, ReleaseYear, ArtistID) VALUES
-- Taylor Swift (1)
(1,  'Fearless', 2008, 1),
(2,  'Red', 2012, 1),
(3,  '1989', 2014, 1),
(4,  'Reputation', 2017, 1),
-- Ed Sheeran (2)
(5,  'Plus', 2011, 2),
(6,  'Multiply', 2014, 2),
(7,  'Divide', 2017, 2),
(8,  'Equals', 2021, 2),
-- Adele (3)
(9,  '19', 2008, 3),
(10, '21', 2011, 3),
(11, '25', 2015, 3),
(12, '30', 2021, 3),
-- Drake (4)
(13, 'Take Care', 2011, 4),
(14, 'Nothing Was the Same', 2013, 4),
(15, 'Views', 2016, 4),
(16, 'Scorpion', 2018, 4),
-- BTS (5)
(17, '2 Cool 4 Skool', 2013, 5),
(18, 'Wings', 2016, 5),
(19, 'Love Yourself: Tear', 2018, 5),
(20, 'Map of the Soul: 7', 2020, 5),
-- Billie Eilish (6)
(21, 'When We All Fall Asleep', 2019, 6),
(22, 'Happier Than Ever', 2021, 6),
-- Bruno Mars (7)
(23, 'Doo-Wops & Hooligans', 2010, 7),
(24, 'Unorthodox Jukebox', 2012, 7),
(25, '24K Magic', 2016, 7),
-- Blackpink (8)
(26, 'The Album', 2020, 8),
(27, 'Born Pink', 2022, 8),
-- The Weeknd (9)
(28, 'Kiss Land', 2013, 9),
(29, 'Beauty Behind the Madness', 2015, 9),
(30, 'Starboy', 2016, 9),
(31, 'After Hours', 2020, 9),
-- Ariana Grande (10)
(32, 'Yours Truly', 2013, 10),
(33, 'Dangerous Woman', 2016, 10),
(34, 'Sweetener', 2018, 10),
(35, 'Thank U, Next', 2019, 10),
-- Coldplay (11)
(36, 'Parachutes', 2000, 11),
(37, 'A Rush of Blood to the Head', 2002, 11),
(38, 'Viva la Vida', 2008, 11),
(39, 'Music of the Spheres', 2021, 11),
-- Imagine Dragons (12)
(40, 'Night Visions', 2012, 12),
(41, 'Smoke + Mirrors', 2015, 12),
(42, 'Evolve', 2017, 12),
(43, 'Mercury – Act 1', 2021, 12),
-- Shawn Mendes (13)
(44, 'Handwritten', 2015, 13),
(45, 'Illuminate', 2016, 13),
(46, 'Wonder', 2020, 13),
-- Justin Bieber (14)
(47, 'My World 2.0', 2010, 14),
(48, 'Purpose', 2015, 14),
(49, 'Justice', 2021, 14),
-- IU (15)
(50, 'Palette', 2017, 15),
(51, 'Love Poem', 2019, 15),
(52, 'Lilac', 2021, 15),
-- Charlie Puth (16)
(53, 'Nine Track Mind', 2016, 16),
(54, 'Voicenotes', 2018, 16),
(55, 'Charlie', 2022, 16),
-- Maroon 5 (17)
(56, 'Songs About Jane', 2002, 17),
(57, 'It Won’t Be Soon Before Long', 2007, 17),
(58, 'Overexposed', 2012, 17),
(59, 'Jordi', 2021, 17),
-- Rihanna (18)
(60, 'Music of the Sun', 2005, 18),
(61, 'Good Girl Gone Bad', 2007, 18),
(62, 'Loud', 2010, 18),
(63, 'Anti', 2016, 18),
-- Eminem (19)
(64, 'The Slim Shady LP', 1999, 19),
(65, 'The Marshall Mathers LP', 2000, 19),
(66, 'Recovery', 2010, 19),
(67, 'Music to Be Murdered By', 2020, 19),
-- Lady Gaga (20)
(68, 'The Fame', 2008, 20),
(69, 'Born This Way', 2011, 20),
(70, 'Joanne', 2016, 20),
(71, 'Chromatica', 2020, 20),
-- Sam Smith (21)
(72, 'In the Lonely Hour', 2014, 21),
(73, 'The Thrill of It All', 2017, 21),
(74, 'Gloria', 2023, 21),
-- Dua Lipa (22)
(75, 'Dua Lipa', 2017, 22),
(76, 'Future Nostalgia', 2020, 22),
-- Post Malone (23)
(77, 'Stoney', 2016, 23),
(78, 'Beerbongs & Bentleys', 2018, 23),
(79, 'Hollywood’s Bleeding', 2019, 23),
-- SZA (24)
(80, 'Ctrl', 2017, 24),
(81, 'SOS', 2022, 24),
-- Kendrick Lamar (25)
(82, 'Good Kid, M.A.A.D City', 2012, 25),
(83, 'To Pimp a Butterfly', 2015, 25),
(84, 'DAMN.', 2017, 25),
-- Harry Styles (26)
(85, 'Harry Styles', 2017, 26),
(86, 'Fine Line', 2019, 26),
(87, 'Harry’s House', 2022, 26),
-- Selena Gomez (27)
(88, 'Stars Dance', 2013, 27),
(89, 'Revival', 2015, 27),
(90, 'Rare', 2020, 27),
-- Red Velvet (28)
(91, 'The Red', 2015, 28),
(92, 'Perfect Velvet', 2017, 28),
(93, 'The ReVe Festival Finale', 2019, 28),
-- G-Dragon (29)
(94, 'Heartbreaker', 2009, 29),
(95, 'Coup dEtat', 2013, 29),
-- Alicia Keys (30)
(96, 'Songs in A Minor', 2001, 30),
(97, 'The Diary of Alicia Keys', 2003, 30),
(98, 'As I Am', 2007, 30),
(99, 'Girl on Fire', 2012, 30),
(100,'Alicia', 2020, 30);

-- Genres
INSERT INTO Genres (ID, Name) VALUES
(1, 'Pop'),
(2, 'Rock'),
(3, 'Hip Hop'),
(4, 'R&B'),
(5, 'Jazz'),
(6, 'Classical'),
(7, 'Electronic'),
(8, 'K-Pop'),
(9, 'Country'),
(10, 'Indie'),
(11, 'Metal'),
(12, 'Soul');

-- Tracks
INSERT INTO Tracks (ID, Title, Duration, Language, AlbumID, GenreID) VALUES
-- Album 1: Fearless (Pop)
(1, 'Fearless', 241, 'English', 1, 1),
(2, 'Love Story', 235, 'English', 1, 1),
(3, 'You Belong With Me', 231, 'English', 1, 1),
-- Album 2: Red
(4, 'State of Grace', 275, 'English', 2, 1),
(5, 'Red', 223, 'English', 2, 1),
(6, 'I Knew You Were Trouble', 219, 'English', 2, 1),
-- Album 3: 1989
(7, 'Welcome To New York', 212, 'English', 3, 1),
(8, 'Blank Space', 231, 'English', 3, 1),
(9, 'Shake It Off', 242, 'English', 3, 1),
-- Album 4: Reputation
(10, '...Ready For It?', 208, 'English', 4, 1),
(11, 'Delicate', 232, 'English', 4, 1),
(12, 'Look What You Made Me Do', 211, 'English', 4, 1),
-- Album 5: Plus
(13, 'The A Team', 258, 'English', 5, 1),
(14, 'Lego House', 185, 'English', 5, 1),
(15, 'Give Me Love', 285, 'English', 5, 1),
-- Album 6: Multiply
(16, 'Sing', 235, 'English', 6, 1),
(17, 'Don’t', 219, 'English', 6, 1),
(18, 'Thinking Out Loud', 281, 'English', 6, 1),
-- Album 7: Divide
(19,'Eraser', 227, 'English', 7, 1),
(20,'Castle On The Hill', 261, 'English', 7, 1),
(21,'Shape Of You', 233, 'English', 7, 1),
(22,'You’re My Best Friend', 170, 'English', 7, 2),
(23,'Love of My Life', 218, 'English', 7, 2),
-- Album 8: Equals
(24,'Bad Habits', 231, 'English', 8, 1),
(25,'Shivers', 207, 'English', 8, 1),
-- Album 9: 19
(26,'Daydreamer', 220, 'English', 9, 12),
(27,'Chasing Pavements', 210, 'English', 9, 12),
(28,'Make You Feel My Love', 213, 'English', 9, 12),
-- Album 10: 21
(29,'Rolling In The Deep', 228, 'English', 10, 12),
(30,'Someone Like You', 285, 'English', 10, 12),
(31,'Set Fire To The Rain', 242, 'English', 10, 12),
(32,'Come As You Are', 219, 'English', 10, 2),
-- Album 11: 25
(33,'Hello', 295, 'English', 11, 12),
(34,'Send My Love', 223, 'English', 11, 12),
(35,'When We Were Young', 289, 'English', 11, 12),
-- Album 12: 30
(36,'Easy On Me', 224, 'English', 12, 12),
(37,'Oh My God', 225, 'English', 12, 12),
-- Album 13: Take Care (Hip Hop)
(38,'Over My Dead Body', 272, 'English', 13, 3),
(39,'Headlines', 235, 'English', 13, 3),
(40,'Take Care', 277, 'English', 13, 3),
-- Album 14
(41,'Tuscan Leather', 366, 'English', 14, 3),
(42,'Started From The Bottom', 174, 'English', 14, 3),
(43,'Hold On We’re Going Home', 227, 'English', 14, 3),
-- Album 15
(44,'Keep The Family Close', 332, 'English', 15, 3),
(45,'One Dance', 173, 'English', 15, 3),
(46,'Hotline Bling', 267, 'English', 15, 3),
-- Album 16
(47,'Survival', 136, 'English', 16, 3),
(48,'Nonstop', 238, 'English', 16, 3),
(49,'In My Feelings', 217, 'English', 16, 3),
(50,'Paradise', 278, 'English', 16, 1),
(51,'Charlie Brown', 285, 'English', 16, 1),
-- Album 17: BTS
(52,'No More Dream', 222, 'Korean', 17, 8),
(53,'We Are Bulletproof Pt.2', 208, 'Korean', 17, 8),
(54,'N.O', 210, 'Korean', 17, 8),
(55,'Under the Bridge', 264, 'English', 17, 2),
-- Album 18
(56,'Blood Sweat & Tears', 215, 'Korean', 18, 8),
(57,'Lie', 234, 'Korean', 18, 8),
(58,'Awake', 213, 'Korean', 18, 8),
-- Album 19
(59,'Fake Love', 239, 'Korean', 19, 8),
(60,'The Truth Untold', 241, 'Korean', 19, 8),
(61,'Anpanman', 212, 'Korean', 19, 8),
-- Album 20
(62,'ON', 255, 'Korean', 20, 8),
(63,'Black Swan', 198, 'Korean', 20, 8),
(64,'Filter', 180, 'Korean', 20, 8),
-- Album 21: Billie Eilish
(65,'Bad Guy', 194, 'English', 21, 1),
(66,'When The Party’s Over', 196, 'English', 21, 1),
-- Album 22
(67,'Therefore I Am', 174, 'English', 22, 1),
(68,'Happier Than Ever', 298, 'English', 22, 1),
(303,'Your Power', 245, 'English', 22, 1),
-- Album 23: Bruno Mars
(69,'Grenade', 223, 'English', 23, 1),
(70,'Just The Way You Are', 220, 'English', 23, 1),
(71,'The Lazy Song', 189, 'English', 23, 1),
-- Album 24
(72,'Locked Out Of Heaven', 233, 'English', 24, 1),
(73,'When I Was Your Man', 214, 'English', 24, 1),
(74,'Treasure', 178, 'English', 24, 1),
-- Album 25
(75,'24K Magic', 226, 'English', 25, 1),
(76,'That’s What I Like', 206, 'English', 25, 1),
(77,'Versace On The Floor', 261, 'English', 25, 1),
-- Album 26: Blackpink
(78,'How You Like That', 181, 'Korean', 26, 8),
(79,'Lovesick Girls', 192, 'Korean', 26, 8),
(80,'Pretty Savage', 201, 'Korean', 26, 8),
-- Album 27
(81,'Pink Venom', 187, 'Korean', 27, 8),
(82,'Shut Down', 175, 'Korean', 27, 8),
(83,'Typa Girl', 179, 'Korean', 27, 8),
-- Album 28: The Weeknd
(84,'Professional', 242, 'English', 28, 4),
(85,'The Town', 300, 'English', 28, 4),
(86,'Wanderlust', 305, 'English', 28, 4),
-- Album 29
(87,'Can’t Feel My Face', 215, 'English', 29, 4),
(88,'The Hills', 242, 'English', 29, 4),
(89,'Earned It', 276, 'English', 29, 4),
-- Album 30
(90,'Starboy', 230, 'English', 30, 4),
(91,'Reminder', 218, 'English', 30, 4),
(92,'I Feel It Coming', 269, 'English', 30, 4),
-- Album 31
(93,'Alone Again', 252, 'English', 31, 4),
(94,'Blinding Lights', 200, 'English', 31, 4),
(95,'Save Your Tears', 215, 'English', 31, 4),
-- Album 32: Ariana Grande
(96,'Honeymoon Avenue', 220, 'English', 32, 1),
(97,'Baby I', 197, 'English', 32, 1),
-- Album 33
(98,'Moonlight', 203, 'English', 33, 1),
(99,'Dangerous Woman', 235, 'English', 33, 1),
(100,'Into You', 244, 'English', 33, 1),
(101,'Under the Bridge', 264, 'English', 17, 2),
-- Album 34
(102,'Raindrops', 37, 'English', 34, 1),
(103,'No Tears Left To Cry', 205, 'English', 34, 1),
(104,'God Is A Woman', 197, 'English', 34, 1),
-- Album 35
(105,'Imagine', 212, 'English', 35, 1),
(106,'7 Rings', 178, 'English', 35, 1),
(107,'Thank U, Next', 207, 'English', 35, 1),
-- Album 36: Coldplay
(108,'Don’t Panic', 137, 'English', 36, 2),
(109,'Yellow', 269, 'English', 36, 2),
(110,'Trouble', 269, 'English', 36, 2),
-- Album 37
(111,'Clocks', 307, 'English', 37, 2),
(112,'The Scientist', 309, 'English', 37, 2),
(113,'In My Place', 229, 'English', 37, 2),
-- Album 38
(114,'Viva La Vida', 242, 'English', 38, 2),
(115,'Lost!', 236, 'English', 38, 2),
(116,'Strawberry Swing', 249, 'English', 38, 2),
-- Album 39
(117,'Higher Power', 203, 'English', 39, 7),
(118,'My Universe', 226, 'English', 39, 7),
(119,'Coloratura', 634, 'English', 39, 7),
-- Album 40: Imagine Dragons
(120,'Radioactive', 186, 'English', 40, 2),
(121,'Demons', 177, 'English', 40, 2),
(122,'On Top Of The World', 192, 'English', 40, 2);
INSERT INTO Tracks (ID,Title, Duration, Language, AlbumID, GenreID) VALUES
-- Album 41: Smoke + Mirrors (Imagine Dragons)
(123,'Shots', 232, 'English', 41, 2),
(124,'Gold', 216, 'English', 41, 2),
(125,'I Bet My Life', 193, 'English', 41, 2),
-- Album 42: Evolve
(126,'Next To Me', 230, 'English', 42, 2),
(127,'Believer', 204, 'English', 42, 2),
-- Album 43: Mercury – Act 1
(128,'Enemy', 173, 'English', 43, 2),
(129,'Wrecked', 242, 'English', 43, 2),
(130,'Follow You', 175, 'English', 43, 2),
-- Album 44: Handwritten (Shawn Mendes)
(131,'Life Of The Party', 214, 'English', 44, 1),
(132,'Stitches', 206, 'English', 44, 1),
(133,'Something Big', 161, 'English', 44, 1),
-- Album 45: Illuminate
(134,'Ruin', 231, 'English', 45, 1),
(135,'Treat You Better', 187, 'English', 45, 1),
(136,'Mercy', 208, 'English', 45, 1),
-- Album 46: Wonder
(137,'Wonder', 172, 'English', 46, 1),
(138,'Monster', 178, 'English', 46, 1),
(139,'Call My Friends', 151, 'English', 46, 1),
-- Album 47: My World 2.0 (Justin Bieber)
(140,'Baby', 214, 'English', 47, 1),
(141,'Somebody To Love', 220, 'English', 47, 1),
(142,'U Smile', 196, 'English', 47, 1),
-- Album 48: Purpose
(143,'Mark My Words', 134, 'English', 48, 1),
(144,'Sorry', 200, 'English', 48, 1),
(145,'Love Yourself', 233, 'English', 48, 1),
-- Album 49: Justice
(146,'Holy', 212, 'English', 49, 1),
(147,'Peaches', 198, 'English', 49, 1),
(148,'Ghost', 153, 'English', 49, 1),
-- Album 50: Palette (IU)
(149,'Palette', 217, 'Korean', 50, 8),
(150,'Through The Night', 256, 'Korean', 50, 8),
(151,'Jam Jam', 195, 'Korean', 50, 8),
-- Album 51: Love Poem
(152,'Unlucky', 201, 'Korean', 51, 8),
(153,'Love Poem', 243, 'Korean', 51, 8),
(154,'Blueming', 217, 'Korean', 51, 8),
-- Album 52: Lilac
(155,'Lilac', 214, 'Korean', 52, 8),
(156,'Celebrity', 195, 'Korean', 52, 8),
(157,'Coin', 183, 'Korean', 52, 8),
(158,'High Hopes', 190, 'English', 52, 1),
-- Album 53: Nine Track Mind (Charlie Puth)
(159,'One Call Away', 194, 'English', 53, 1),
(160,'We Don’t Talk Anymore', 217, 'English', 53, 1),
(161,'Marvin Gaye', 189, 'English', 53, 1),
-- Album 54: Voicenotes
(162,'Attention', 211, 'English', 54, 1),
(163,'How Long', 200, 'English', 54, 1),
(164,'Done For Me', 180, 'English', 54, 1),
-- Album 55: Charlie
(165,'Light Switch', 185, 'English', 55, 1),
(166,'Left And Right', 154, 'English', 55, 1),
(167,'That’s Hilarious', 167, 'English', 55, 1),
-- Album 56: Songs About Jane (Maroon 5)
(168,'Harder To Breathe', 173, 'English', 56, 2),
(169,'This Love', 206, 'English', 56, 2),
(170,'She Will Be Loved', 257, 'English', 56, 2),
-- Album 57
(171,'Makes Me Wonder', 192, 'English', 57, 2),
(172,'Wake Up Call', 202, 'English', 57, 2),
(173,'Won’t Go Home Without You', 230, 'English', 57, 2),
-- Album 58
(174,'Payphone', 231, 'English', 58, 2),
(175,'One More Night', 220, 'English', 58, 2),
(176,'Daylight', 226, 'English', 58, 2),
-- Album 59
(177,'Memories', 189, 'English', 59, 2),
(178,'Nobody’s Love', 211, 'English', 59, 2),
(179,'Lost', 171, 'English', 59, 2),
-- Album 60: Music Of The Sun (Rihanna)
(180,'Pon De Replay', 246, 'English', 60, 4),
(181,'If It’s Lovin’ That You Want', 211, 'English', 60, 4),
(182,'Let Me', 195, 'English', 60, 4),
-- Album 61
(183,'Umbrella', 262, 'English', 61, 4),
(184,'Shut Up And Drive', 213, 'English', 61, 4),
(185,'Don’t Stop The Music', 267, 'English', 61, 4),
-- Album 62
(186,'Only Girl', 235, 'English', 62, 4),
(187,'What’s My Name', 262, 'English', 62, 4),
(188,'S&M', 244, 'English', 62, 4),
-- Album 63
(189,'Work', 219, 'English', 63, 4),
(190,'Needed Me', 191, 'English', 63, 4),
(191,'Love On The Brain', 224, 'English', 63, 4),
-- Album 64: Slim Shady LP (Eminem)
(192,'My Name Is', 268, 'English', 64, 3),
(193,'Guilty Conscience', 199, 'English', 64, 3),
(194,'Role Model', 204, 'English', 64, 3),
-- Album 65
(195,'The Real Slim Shady', 284, 'English', 65, 3),
(196,'Stan', 404, 'English', 65, 3),
(197,'The Way I Am', 290, 'English', 65, 3),
-- Album 66
(198,'Not Afraid', 248, 'English', 66, 3),
(199,'Love The Way You Lie', 263, 'English', 66, 3),
(200,'No Love', 299, 'English', 66, 3),
-- Album 67
(201,'Godzilla', 210, 'English', 67, 3),
(202,'Darkness', 337, 'English', 67, 3),
(203,'Lose Yourself', 326, 'English', 67, 3),
-- Album 68: The Fame (Lady Gaga)
(204,'Just Dance', 241, 'English', 68, 1),
(205,'Poker Face', 237, 'English', 68, 1),
(206,'Paparazzi', 208, 'English', 68, 1),
-- Album 69
(207,'Born This Way', 260, 'English', 69, 1),
(208,'Judas', 249, 'English', 69, 1),
(209,'The Edge Of Glory', 320, 'English', 69, 1),
-- Album 70
(210,'Perfect Illusion', 182, 'English', 70, 1),
(211,'Million Reasons', 205, 'English', 70, 1),
(212,'Joanne', 210, 'English', 70, 1);
INSERT INTO Tracks (ID,Title, Duration, Language, AlbumID, GenreID) VALUES
-- Album 71: Chromatica (Lady Gaga)
(213,'Chromatica I', 60, 'English', 71, 7),
(214,'Rain On Me', 182, 'English', 71, 7),
(215,'Stupid Love', 193, 'English', 71, 7),
-- Album 72: In The Lonely Hour (Sam Smith)
(216,'Stay With Me', 172, 'English', 72, 12),
(217,'I’m Not The Only One', 239, 'English', 72, 12),
(218,'Lay Me Down', 253, 'English', 72, 12),
-- Album 73
(219,'Too Good At Goodbyes', 201, 'English', 73, 12),
(220,'Pray', 221, 'English', 73, 12),
(221,'HIM', 214, 'English', 73, 12),
-- Album 74
(222,'Unholy', 156, 'English', 74, 1),
(223,'Love Me More', 210, 'English', 74, 1),
(224,'Gloria', 215, 'English', 74, 1),
-- Album 75: Dua Lipa
(225,'Be The One', 202, 'English', 75, 1),
(226,'IDGAF', 217, 'English', 75, 1),
(227,'New Rules', 209, 'English', 75, 1),
-- Album 76
(228,'Don’t Start Now', 183, 'English', 76, 1),
(229,'Physical', 193, 'English', 76, 1),
(230,'Levitating', 203, 'English', 76, 1),
-- Album 77: Stoney (Post Malone)
(231,'White Iverson', 256, 'English', 77, 3),
(232,'Congratulations', 220, 'English', 77, 3),
(233,'Go Flex', 179, 'English', 77, 3),
-- Album 78
(234,'Rockstar', 218, 'English', 78, 3),
(235,'Psycho', 221, 'English', 78, 3),
-- Album 79
(236,'Circles', 215, 'English', 79, 3),
(237,'Sunflower', 158, 'English', 79, 3),
(238,'Wow.', 149, 'English', 79, 3),
(239,'Take What You Want', 231, 'English', 79, 3),
(240,'Goodbyes', 174, 'English', 79, 3),
-- Album 80: Ctrl (SZA)
(241,'Supermodel', 181, 'English', 80, 4),
(242,'Love Galore', 215, 'English', 80, 4),
(243,'The Weekend', 272, 'English', 80, 4),
-- Album 81
(244,'Good Days', 279, 'English', 81, 4),
(245,'Kill Bill', 153, 'English', 81, 4),
(246,'Snooze', 201, 'English', 81, 4),
-- Album 82: Good Kid, M.A.A.D City (Kendrick Lamar)
(247,'Sherane', 273, 'English', 82, 3),
(248,'Bitch Don’t Kill My Vibe', 310, 'English', 82, 3),
(249,'Swimming Pools', 313, 'English', 82, 3),
-- Album 83
(250,'Wesley’s Theory', 287, 'English', 83, 3),
(251,'King Kunta', 234, 'English', 83, 3),
(252,'Alright', 219, 'English', 83, 3),
-- Album 84
(253,'DNA.', 185, 'English', 84, 3),
(254,'HUMBLE.', 177, 'English', 84, 3),
(255,'LOVE.', 214, 'English', 84, 3),
-- Album 85: Harry Styles
(256,'Sign Of The Times', 341, 'English', 85, 2),
(257,'Kiwi', 174, 'English', 85, 2),
(258,'Sweet Creature', 224, 'English', 85, 2),
-- Album 86
(259,'Lights Up', 172, 'English', 86, 2),
(260,'Adore You', 207, 'English', 86, 2),
(261,'Watermelon Sugar', 174, 'English', 86, 2),
-- Album 87
(262,'As It Was', 167, 'English', 87, 2),
(263,'Late Night Talking', 178, 'English', 87, 2),
(264,'Music For A Sushi Restaurant', 194, 'English', 87, 2),
-- Album 88: Stars Dance (Selena Gomez)
(265,'Birthday', 198, 'English', 88, 1),
(266,'Slow Down', 211, 'English', 88, 1),
(267,'Come & Get It', 231, 'English', 88, 1),
-- Album 89
(268,'Good For You', 221, 'English', 89, 1),
(269,'Hands To Myself', 201, 'English', 89, 1),
(270,'Same Old Love', 229, 'English', 89, 1),
-- Album 90
(271,'Lose You To Love Me', 206, 'English', 90, 1),
(272,'Look At Her Now', 162, 'English', 90, 1),
(273,'Rare', 220, 'English', 90, 1),
-- Album 91: The Red (Red Velvet)
(274,'Dumb Dumb', 203, 'Korean', 91, 8),
(275,'Huff n Puff', 210, 'Korean', 91, 8),
(276,'Oh Boy', 214, 'Korean', 91, 8),
-- Album 92
(277,'Peek-A-Boo', 199, 'Korean', 92, 8),
(278,'Bad Boy', 210, 'Korean', 92, 8),
(279,'Kingdom Come', 224, 'Korean', 92, 8),
-- Album 93
(280,'Psycho', 210, 'Korean', 93, 8),
(281,'In & Out', 190, 'Korean', 93, 8),
(282,'Remember Forever', 223, 'Korean', 93, 8),
-- Album 94: Heartbreaker (G-Dragon)
(283,'Heartbreaker', 222, 'Korean', 94, 8),
(284,'Breathe', 203, 'Korean', 94, 8),
(285,'A Boy', 216, 'Korean', 94, 8),
-- Album 95
(286,'Crooked', 224, 'Korean', 95, 8),
(287,'Who You?', 208, 'Korean', 95, 8),
(288,'Black', 233, 'Korean', 95, 8),
-- Album 96: Songs In A Minor (Alicia Keys)
(289,'Fallin’', 210, 'English', 96, 12),
(290,'A Woman’s Worth', 290, 'English', 96, 12),
(291,'How Come You Don’t Call Me', 220, 'English', 96, 12),
-- Album 97
(292,'You Don’t Know My Name', 366, 'English', 97, 12),
(293,'If I Ain’t Got You', 228, 'English', 97, 12),
-- Album 98
(294,'No One', 252, 'English', 98, 12),
(295,'Like You’ll Never See Me Again', 315, 'English', 98, 12),
(296,'Superwoman', 274, 'English', 98, 12),
-- Album 99
(297,'Girl On Fire', 269, 'English', 99, 12),
(298,'New Day', 203, 'English', 99, 12),
(299,'Brand New Me', 222, 'English', 99, 12),
-- Album 100
(300,'Underdog', 208, 'English', 100, 12),
(301,'Time Machine', 227, 'English', 100, 12),
(302,'Show Me Love', 214, 'English', 100, 12);

-- Users
INSERT INTO Users (ID,Username, Email, SubscriptionType, RegistrationDate) VALUES
(1,'alexm', 'alex.morgan@email.com', 'Premium', '2023-01-15'),
(2,'sarah_k', 'sarah.kim@email.com', 'Free', '2023-02-03'),
(3,'mike_92', 'mike92@email.com', 'Free', '2023-02-18'),
(4,'emma_w', 'emma.wilson@email.com', 'Premium', '2023-03-01'),
(5,'li_wei', 'li.wei@email.com', 'Free', '2023-03-12'),
(6,'carlos_7', 'carlos.g@email.com', 'Premium', '2023-03-25'),
(7,'amina_h', 'amina.h@email.com', 'Free', '2023-04-02'),
(8,'daniel_r', 'daniel.r@email.com', 'Premium', '2023-04-18'),
(9,'sofia_l', 'sofia.lopez@email.com', 'Free', '2023-05-05'),
(10,'samuel_w', 'samuel.w@email.com', 'Premium', '2024-03-18'),
(11,'noah_b', 'noah.b@email.com', 'Premium', '2023-05-22'),
(12,'olivia_j', 'olivia.j@email.com', 'Free', '2023-06-01'),
(13,'lucas_m', 'lucas.m@email.com', 'Premium', '2023-06-14'),
(14,'fatima_z', 'fatima.z@email.com', 'Free', '2023-07-03'),
(15,'ethan_p', 'ethan.p@email.com', 'Premium', '2023-07-19'),
(16,'mia_t', 'mia.t@email.com', 'Free', '2023-08-07'),
(17,'ryan_s', 'ryan.s@email.com', 'Premium', '2023-08-20'),
(18,'hannah_c', 'hannah.c@email.com', 'Free', '2023-09-02'),
(19,'youssef_a', 'youssef.a@email.com', 'Premium', '2023-09-15'),
(20,'isabella_d', 'isabella.d@email.com', 'Free', '2023-10-01'),
(21,'jack_l', 'jack.l@email.com', 'Premium', '2023-10-18'),
(22,'chloe_v', 'chloe.v@email.com', 'Free', '2023-11-04'),
(23,'ahmed_k', 'ahmed.k@email.com', 'Premium', '2023-11-20'),
(24,'grace_n', 'grace.n@email.com', 'Free', '2023-12-01'),
(25,'leo_f', 'leo.f@email.com', 'Premium', '2023-12-15'),
(26,'nora_e', 'nora.e@email.com', 'Free', '2024-01-05'),
(27,'omar_h', 'omar.h@email.com', 'Premium', '2024-01-19'),
(28,'ella_m', 'ella.m@email.com', 'Free', '2024-02-02'),
(29,'adam_t', 'adam.t@email.com', 'Premium', '2024-02-16'),
(30,'zara_s', 'zara.s@email.com', 'Free', '2024-03-01');

-- playlists
INSERT INTO Playlists (ID, Title, UserID, CreatedAt) VALUES-- User 1
(1, 'Chill Vibes', 1, '2023-02-01'),
(2, 'Workout Hits', 1, '2023-03-10'),
-- User 2
(3, 'K-Pop Favorites', 2, '2023-02-15'),
(4, 'Late Night Songs', 2, '2023-04-01'),
-- User 3
(5, 'Road Trip', 3, '2023-03-01'),
(6, 'Old Classics', 3, '2023-05-12'),
-- User 4
(7, 'Focus Mode', 4, '2023-03-20'),
(8, 'Pop Essentials', 4, '2023-04-25'),
-- User 5
(9, 'Mandarin Hits', 5, '2023-04-01'),
(10, 'Relaxing Piano', 5, '2023-06-02'),
-- User 6
(11, 'Spanish Party', 6, '2023-04-10'),
(12, 'Summer 2023', 6, '2023-06-15'),
-- User 7
(13, 'Arabic Mix', 7, '2023-04-20'),
(14, 'Deep Thoughts', 7, '2023-07-01'),
-- User 8
(15, 'Rock Legends', 8, '2023-05-01'),
(16, 'Gym Power', 8, '2023-07-18'),
-- User 9
(17, 'Latin Heat', 9, '2023-05-15'),
(18, 'Love Songs', 9, '2023-08-01'),
-- User 10
(19, 'US Top Hits', 10, '2024-06-01'),
(20, 'Throwbacks', 10, '2024-09-12'),
-- User 11
(21, 'Aussie Chill', 11, '2023-06-20'),
(22, 'Indie Mix', 11, '2023-09-25'),
-- User 12
(23, 'Brazilian Beats', 12, '2023-07-01'),
(24, 'Party Time', 12, '2023-10-05'),
-- User 13
(25, 'Desert Nights', 13, '2023-07-15'),
(26, 'Soft Pop', 13, '2023-11-01'),
-- User 14
(27, 'Morning Energy', 14, '2023-08-01'),
(28, 'Hip Hop Vibes', 14, '2023-11-20'),
-- User 15
(29, 'Italian Classics', 15, '2023-08-15'),
(30, 'Acoustic Mood', 15, '2023-12-05'),
-- User 16 (3 playlists)
(31, 'Irish Folk', 16, '2023-09-01'),
(32, 'Rainy Days', 16, '2023-12-15'),
(33, 'Top 2024', 16, '2024-02-01'),
-- User 17
(34, 'UK Charts', 17, '2023-09-20'),
(35, 'Sad Songs', 17, '2024-01-10'),
(36, 'Dance Floor', 17, '2024-03-01'),
-- User 18
(37, 'Egyptian Mix', 18, '2023-10-01'),
(38, 'Romantic Arabic', 18, '2024-01-25'),
(39, 'Weekend Hits', 18, '2024-03-15'),
-- User 19
(40, 'Argentina Rock', 19, '2023-10-15'),
(41, 'Chill Nights', 19, '2024-02-01'),
(42, 'Gym Playlist', 19, '2024-03-20'),
-- User 20
(43, 'USA Party', 20, '2023-11-01'),
(44, 'Study Mode', 20, '2024-01-15'),
(45, 'Classic Pop', 20, '2024-03-25'),
-- User 21
(46, 'French Hits', 21, '2023-11-15'),
(47, 'Soft Rock', 21, '2024-02-10'),
(48, 'Travel Songs', 21, '2024-03-30'),
-- User 22
(49, 'Saudi Beats', 22, '2023-12-01'),
(50, 'Top Arabic 2024', 22, '2024-02-20'),
(51, 'Night Drive', 22, '2024-04-01'),
-- User 23
(52, 'NZ Chill', 23, '2023-12-20'),
(53, 'Indie Rock', 23, '2024-03-01'),
(54, 'Workout Mix', 23, '2024-04-10'),
-- User 24
(55, 'German Pop', 24, '2024-01-01'),
(56, 'Electro Party', 24, '2024-03-10'),
(57, 'Focus Beats', 24, '2024-04-15'),
-- User 25
(58, 'Nordic Calm', 25, '2024-01-15'),
(59, 'Winter Mood', 25, '2024-03-20'),
(60, 'Top Charts', 25, '2024-04-20'),
-- User 26
(61, 'Jordan Hits', 26, '2024-02-01'),
(62, 'Deep House', 26, '2024-03-25'),
(63, 'Morning Chill', 26, '2024-04-25'),
-- User 27
(64, 'US Indie', 27, '2024-02-10'),
(65, 'Love Mix', 27, '2024-03-30'),
(66, 'Dance Hits', 27, '2024-04-28'),
-- User 28
(67, 'Polish Vibes', 28, '2024-02-20'),
(68, 'Rock Mix', 28, '2024-04-01'),
(69, 'Evening Relax', 28, '2024-05-01'),
-- User 29
(70, 'Bollywood Mix', 29, '2024-03-01'),
(71, 'India Top 50', 29, '2024-04-10'),
(72, 'Chill India', 29, '2024-05-05'),
-- User 30
(73, 'Canada Chill', 30, '2024-03-15'),
(74, 'Hip Hop Canada', 30, '2024-04-15'),
(75, 'Summer 2024', 30, '2024-05-10');
-- PlaylistTracks
INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) VALUES
-- Playlists 1–75 (4 tracks each)
(1,1,'2023-02-02'),(1,25,'2023-02-02'),(1,50,'2023-02-03'),(1,75,'2023-02-04'),
(2,2,'2023-03-11'),(2,26,'2023-03-11'),(2,51,'2023-03-12'),(2,76,'2023-03-13'),
(3,3,'2023-02-16'),(3,27,'2023-02-16'),(3,52,'2023-02-17'),
(4,4,'2023-04-02'),(4,28,'2023-04-02'),(4,53,'2023-04-03'),(4,78,'2023-04-04'),
(5,5,'2023-03-02'),(5,29,'2023-03-02'),(5,54,'2023-03-03'),(5,79,'2023-03-04'),
(6,6,'2023-05-13'),(6,30,'2023-05-13'),(6,55,'2023-05-14'),(6,80,'2023-05-15'),
(7,7,'2023-03-21'),(7,31,'2023-03-21'),(7,56,'2023-03-22'),(7,81,'2023-03-23'),
(8,8,'2023-04-26'),(8,32,'2023-04-26'),(8,57,'2023-04-27'),(8,82,'2023-04-28'),
(9,9,'2023-04-02'),(9,33,'2023-04-02'),(9,58,'2023-04-03'),(9,83,'2023-04-04'),
(10,10,'2023-06-03'),(10,34,'2023-06-03'),(10,59,'2023-06-04'),(10,84,'2023-06-05'),

(11,11,'2023-04-11'),(11,35,'2023-04-11'),(11,60,'2023-04-12'),(11,85,'2023-04-13'),
(12,12,'2023-06-16'),(12,36,'2023-06-16'),(12,61,'2023-06-17'),(12,86,'2023-06-18'),
(13,13,'2023-04-21'),(13,37,'2023-04-21'),(13,62,'2023-04-22'),
(14,14,'2023-07-02'),(14,38,'2023-07-02'),(14,63,'2023-07-03'),(14,88,'2023-07-04'),
(15,15,'2023-05-02'),(15,39,'2023-05-02'),(15,64,'2023-05-03'),(15,89,'2023-05-04'),
(16,16,'2023-09-02'),(16,40,'2023-09-02'),(16,65,'2023-09-03'),(16,90,'2023-09-04'),
(17,17,'2023-09-21'),(17,41,'2023-09-21'),(17,66,'2023-09-22'),(17,91,'2023-09-23'),
(18,18,'2023-10-02'),(18,42,'2023-10-02'),
(19,19,'2024-10-16'),(19,43,'2024-10-16'),(19,68,'2024-10-17'),(19,93,'2024-10-18'),
(20,20,'2024-11-02'),(20,44,'2024-11-02'),(20,69,'2024-11-03'),(20,94,'2024-11-04'),

(21,21,'2023-11-16'),(21,45,'2023-11-16'),(21,70,'2023-11-17'),(21,95,'2023-11-18'),
(22,22,'2023-12-02'),(22,46,'2023-12-02'),(22,71,'2023-12-03'),(22,96,'2023-12-04'),
(23,23,'2023-12-21'),(23,47,'2023-12-21'),
(24,24,'2024-01-02'),(24,48,'2024-01-02'),(24,73,'2024-01-03'),(24,98,'2024-01-04'),
(25,25,'2024-01-16'),(25,49,'2024-01-16'),(25,74,'2024-01-17'),(25,99,'2024-01-18'),

(26,26,'2024-01-20'),(26,76,'2024-01-20'),(26,126,'2024-01-21'),(26,176,'2024-01-22'),
(27,27,'2024-02-02'),(27,77,'2024-02-02'),(27,127,'2024-02-03'),(27,177,'2024-02-04'),
(28,28,'2024-02-17'),(28,78,'2024-02-17'),(28,128,'2024-02-18'),(28,178,'2024-02-19'),
(29,29,'2024-03-02'),(29,79,'2024-03-02'),(29,129,'2024-03-03'),(29,179,'2024-03-04'),
(30,30,'2024-03-19'),(30,80,'2024-03-19'),(30,130,'2024-03-20'),(30,180,'2024-03-21'),

(31,31,'2024-02-02'),(31,81,'2024-02-02'),(31,131,'2024-02-03'),(31,181,'2024-02-04'),
(32,32,'2024-02-16'),(32,82,'2024-02-16'),(32,132,'2024-02-17'),(32,182,'2024-02-18'),
(33,33,'2024-02-02'),(33,83,'2024-02-02'),(33,133,'2024-02-03'),
(34,34,'2024-03-02'),(34,84,'2024-03-02'),(34,134,'2024-03-03'),(34,184,'2024-03-04'),
(35,35,'2024-03-12'),(35,85,'2024-03-12'),(35,135,'2024-03-13'),(35,185,'2024-03-14'),(35,125,'2025-03-15'),(35,140,'2025-03-16'),

(36,36,'2024-03-02'),(36,86,'2024-03-02'),(36,136,'2024-03-03'),(36,186,'2024-03-04'),
(37,37,'2024-03-16'),(37,87,'2024-03-16'),(37,137,'2024-03-17'),(37,187,'2024-03-18'),
(38,38,'2024-03-26'),(38,88,'2024-03-26'),
(40,40,'2024-02-02'),(40,90,'2024-02-02'),(40,140,'2024-02-03'),(40,190,'2024-02-04'),

(41,41,'2024-02-12'),(41,91,'2024-02-12'),(41,141,'2024-02-13'),
(42,42,'2024-03-22'),(42,92,'2024-03-22'),(42,142,'2024-03-23'),(42,192,'2024-03-24'),(42,200,'2024-07-24'),(42,207,'2024-08-12'),
(43,43,'2024-01-16'),(43,93,'2024-01-16'),(43,143,'2024-01-17'),
(44,44,'2024-01-16'),(44,94,'2024-01-16'),(44,144,'2024-01-17'),(44,194,'2024-01-18'),

(46,46,'2024-02-11'),(46,96,'2024-02-11'),(46,146,'2024-02-12'),(46,196,'2024-02-13'),
(47,47,'2024-03-01'),(47,97,'2024-03-01'),(47,147,'2024-03-02'),(47,197,'2024-03-03'),
(48,48,'2024-03-31'),(48,98,'2024-03-31'),
(49,49,'2024-02-21'),(49,99,'2024-02-21'),(49,149,'2024-02-22'),(49,199,'2024-02-23'),
(50,50,'2024-02-21'),(50,100,'2024-02-21'),(50,150,'2024-02-22'),(50,200,'2024-02-23'),

(51,51,'2024-04-02'),(51,101,'2024-04-02'),(51,151,'2024-04-03'),(51,201,'2024-04-04'),
(52,52,'2024-03-02'),(52,102,'2024-03-02'),(52,152,'2024-03-03'),(52,202,'2024-03-04'),
(53,53,'2024-04-11'),(53,103,'2024-04-11'),(53,153,'2024-04-12'),(53,203,'2024-04-13'),
(54,54,'2024-04-11'),(54,104,'2024-04-11'),(54,154,'2024-04-12'),(54,204,'2024-04-13'),
(55,55,'2024-04-16'),(55,105,'2024-04-16'),(55,155,'2024-04-17'),(55,205,'2024-04-18'),

(56,56,'2024-03-11'),(56,106,'2024-03-11'),(56,156,'2024-03-12'),(56,206,'2024-03-13'),
(57,57,'2024-04-16'),(57,107,'2024-04-16'),(57,157,'2024-04-17'),(57,207,'2024-04-18'),
(58,58,'2024-03-21'),(58,108,'2024-03-21'),(58,158,'2024-03-22'),(58,208,'2024-03-23'),
(59,59,'2024-04-21'),(59,109,'2024-04-21'),(59,159,'2024-04-22'),(59,209,'2024-04-23'),
(60,60,'2024-04-21'),(60,110,'2024-04-21'),(60,160,'2024-04-22'),(60,210,'2024-04-23'),

(61,61,'2024-04-26'),(61,111,'2024-04-26'),(61,161,'2024-04-27'),(61,211,'2024-04-28'),
(62,62,'2024-04-26'),(62,112,'2024-04-26'),(62,162,'2024-04-27'),(62,212,'2024-04-28'),
(63,63,'2024-04-26'),(63,113,'2024-04-26'),(63,163,'2024-04-27'),(63,213,'2024-04-28'),
(64,64,'2024-04-29'),(64,114,'2024-04-29'),(64,164,'2024-04-30'),(64,214,'2024-05-01'),
(65,65,'2024-04-29'),(65,115,'2024-04-29'),(65,165,'2024-04-30'),(65,215,'2024-05-01'),

(66,66,'2024-04-29'),(66,116,'2024-04-29'),(66,166,'2024-04-30'),(66,216,'2024-05-01'),
(67,67,'2024-05-02'),(67,117,'2024-05-02'),(67,167,'2024-05-03'),(67,217,'2024-05-04'),
(68,68,'2024-05-02'),(68,118,'2024-05-02'),(68,168,'2024-05-03'),(68,218,'2024-05-04'),
(69,69,'2024-05-02'),(69,119,'2024-05-02'),(69,169,'2024-05-03'),(69,219,'2024-05-04'),
(70,70,'2024-05-06'),(70,120,'2024-05-06'),(70,170,'2024-05-07'),(70,220,'2024-05-08'),

(71,71,'2024-05-06'),(71,121,'2024-05-06'),(71,171,'2024-05-07'),(71,221,'2024-05-08'),
(72,72,'2024-05-06'),(72,122,'2024-05-06'),(72,172,'2024-05-07'),(72,222,'2024-05-08'),
(73,73,'2024-05-11'),(73,123,'2024-05-11'),(73,173,'2024-05-12'),(73,223,'2024-05-13'),
(74,74,'2024-05-11'),(74,124,'2024-05-11'),(74,174,'2024-05-12'),(74,224,'2024-05-13'),
(75,150,'2024-05-11'),(75,175,'2024-05-11'),(75,200,'2024-05-12'),(75,225,'2024-05-13');
`;
export const PE_MUSIC_TSQL = String.raw`
CREATE TABLE Artists (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
	Gender nvarchar(20),
    Country NVARCHAR(50),
    Birthdate date
);

-- 2. Albums Table
CREATE TABLE Albums (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    ReleaseYear INT CHECK (ReleaseYear > 1900),
    ArtistID INT FOREIGN KEY REFERENCES Artists(ID)
);

-- 3. Genres Table
CREATE TABLE Genres (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) UNIQUE NOT NULL
);

-- 4. Tracks Table
CREATE TABLE Tracks (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(200) NOT NULL,
    Duration INT NOT NULL, -- Duration in seconds
	Language nvarchar(100),
    AlbumID INT FOREIGN KEY REFERENCES Albums(ID),
    GenreID INT FOREIGN KEY REFERENCES Genres(ID)
);

-- 5. Users Table
CREATE TABLE Users (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Username NVARCHAR(50) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    SubscriptionType NVARCHAR(20) DEFAULT 'Free' CHECK (SubscriptionType IN ('Free', 'Premium')),
    RegistrationDate DATE DEFAULT GETDATE()
);

-- 6. Playlists Table
CREATE TABLE Playlists (
    ID INT PRIMARY KEY IDENTITY(1,1),
    Title NVARCHAR(100) NOT NULL,
    UserID INT FOREIGN KEY REFERENCES Users(ID),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- 7. PlaylistTracks 
CREATE TABLE PlaylistTracks (
    PlaylistID INT FOREIGN KEY REFERENCES Playlists(ID),
    TrackID INT FOREIGN KEY REFERENCES Tracks(ID),
    AddedDate DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (PlaylistID, TrackID)
);
GO

----------------- Insert data ----------------------
-- Artists
SET IDENTITY_INSERT Artists ON;
INSERT INTO Artists (ID, Name, Gender, Country, Birthdate) VALUES
(1,  'Taylor Swift',        'Female', 'USA',        '1989-12-13'),
(2,  'Ed Sheeran',          'Male',   'UK',         '1991-02-17'),
(3,  'Adele',               'Female', 'UK',         '1988-05-05'),
(4,  'Drake',               'Male',   'Canada',     '1986-10-24'),
(5,  'BTS',                 'Group',  'South Korea','2013-06-13'),
(6,  'Billie Eilish',       'Female', 'USA',        '2001-12-18'),
(7,  'Bruno Mars',          'Male',   'USA',        '1985-10-08'),
(8,  'Blackpink',           'Group',  'South Korea','2016-08-08'),
(9,  'The Weeknd',          'Male',   'Canada',     '1990-02-16'),
(10, 'Ariana Grande',       'Female', 'USA',        '1993-06-26'),
(11, 'Coldplay',            'Group',  'UK',         '1996-01-16'),
(12, 'Imagine Dragons',     'Group',  'USA',        '2008-01-01'),
(13, 'Shawn Mendes',        'Male',   'Canada',     '1998-08-08'),
(14, 'Justin Bieber',       'Male',   'Canada',     '1994-03-01'),
(15, 'IU',                  'Female', 'South Korea','1993-05-16'),
(16, 'Charlie Puth',        'Male',   'USA',        '1991-12-02'),
(17, 'Maroon 5',            'Group',  'USA',        '1994-01-01'),
(18, 'Rihanna',             'Female', 'Barbados',   '1988-02-20'),
(19, 'Eminem',              'Male',   'USA',        '1972-10-17'),
(20, 'Lady Gaga',           'Female', 'USA',        '1986-03-28'),
(21, 'Sam Smith',           'Male',   'UK',         '1992-05-19'),
(22, 'Dua Lipa',            'Female', 'UK',         '1995-08-22'),
(23, 'Post Malone',         'Male',   'USA',        '1995-07-04'),
(24, 'SZA',                 'Female', 'USA',        '1989-11-08'),
(25, 'Kendrick Lamar',      'Male',   'USA',        '1987-06-17'),
(26, 'Harry Styles',        'Male',   'UK',         '1994-02-01'),
(27, 'Selena Gomez',        'Female', 'USA',        '1992-07-22'),
(28, 'Red Velvet',          'Group',  'South Korea','2014-08-01'),
(29, 'G-Dragon',            'Male',   'South Korea','1988-08-18'),
(30, 'Alicia Keys',         'Female', 'USA',        '1981-01-25');
SET IDENTITY_INSERT Artists OFF;

-- Albums
SET IDENTITY_INSERT Albums ON;

INSERT INTO Albums (ID, Title, ReleaseYear, ArtistID) VALUES
-- Taylor Swift (1)
(1,  'Fearless', 2008, 1),
(2,  'Red', 2012, 1),
(3,  '1989', 2014, 1),
(4,  'Reputation', 2017, 1),
-- Ed Sheeran (2)
(5,  'Plus', 2011, 2),
(6,  'Multiply', 2014, 2),
(7,  'Divide', 2017, 2),
(8,  'Equals', 2021, 2),
-- Adele (3)
(9,  '19', 2008, 3),
(10, '21', 2011, 3),
(11, '25', 2015, 3),
(12, '30', 2021, 3),
-- Drake (4)
(13, 'Take Care', 2011, 4),
(14, 'Nothing Was the Same', 2013, 4),
(15, 'Views', 2016, 4),
(16, 'Scorpion', 2018, 4),
-- BTS (5)
(17, '2 Cool 4 Skool', 2013, 5),
(18, 'Wings', 2016, 5),
(19, 'Love Yourself: Tear', 2018, 5),
(20, 'Map of the Soul: 7', 2020, 5),
-- Billie Eilish (6)
(21, 'When We All Fall Asleep', 2019, 6),
(22, 'Happier Than Ever', 2021, 6),
-- Bruno Mars (7)
(23, 'Doo-Wops & Hooligans', 2010, 7),
(24, 'Unorthodox Jukebox', 2012, 7),
(25, '24K Magic', 2016, 7),
-- Blackpink (8)
(26, 'The Album', 2020, 8),
(27, 'Born Pink', 2022, 8),
-- The Weeknd (9)
(28, 'Kiss Land', 2013, 9),
(29, 'Beauty Behind the Madness', 2015, 9),
(30, 'Starboy', 2016, 9),
(31, 'After Hours', 2020, 9),
-- Ariana Grande (10)
(32, 'Yours Truly', 2013, 10),
(33, 'Dangerous Woman', 2016, 10),
(34, 'Sweetener', 2018, 10),
(35, 'Thank U, Next', 2019, 10),
-- Coldplay (11)
(36, 'Parachutes', 2000, 11),
(37, 'A Rush of Blood to the Head', 2002, 11),
(38, 'Viva la Vida', 2008, 11),
(39, 'Music of the Spheres', 2021, 11),
-- Imagine Dragons (12)
(40, 'Night Visions', 2012, 12),
(41, 'Smoke + Mirrors', 2015, 12),
(42, 'Evolve', 2017, 12),
(43, 'Mercury – Act 1', 2021, 12),
-- Shawn Mendes (13)
(44, 'Handwritten', 2015, 13),
(45, 'Illuminate', 2016, 13),
(46, 'Wonder', 2020, 13),
-- Justin Bieber (14)
(47, 'My World 2.0', 2010, 14),
(48, 'Purpose', 2015, 14),
(49, 'Justice', 2021, 14),
-- IU (15)
(50, 'Palette', 2017, 15),
(51, 'Love Poem', 2019, 15),
(52, 'Lilac', 2021, 15),
-- Charlie Puth (16)
(53, 'Nine Track Mind', 2016, 16),
(54, 'Voicenotes', 2018, 16),
(55, 'Charlie', 2022, 16),
-- Maroon 5 (17)
(56, 'Songs About Jane', 2002, 17),
(57, 'It Won’t Be Soon Before Long', 2007, 17),
(58, 'Overexposed', 2012, 17),
(59, 'Jordi', 2021, 17),
-- Rihanna (18)
(60, 'Music of the Sun', 2005, 18),
(61, 'Good Girl Gone Bad', 2007, 18),
(62, 'Loud', 2010, 18),
(63, 'Anti', 2016, 18),
-- Eminem (19)
(64, 'The Slim Shady LP', 1999, 19),
(65, 'The Marshall Mathers LP', 2000, 19),
(66, 'Recovery', 2010, 19),
(67, 'Music to Be Murdered By', 2020, 19),
-- Lady Gaga (20)
(68, 'The Fame', 2008, 20),
(69, 'Born This Way', 2011, 20),
(70, 'Joanne', 2016, 20),
(71, 'Chromatica', 2020, 20),
-- Sam Smith (21)
(72, 'In the Lonely Hour', 2014, 21),
(73, 'The Thrill of It All', 2017, 21),
(74, 'Gloria', 2023, 21),
-- Dua Lipa (22)
(75, 'Dua Lipa', 2017, 22),
(76, 'Future Nostalgia', 2020, 22),
-- Post Malone (23)
(77, 'Stoney', 2016, 23),
(78, 'Beerbongs & Bentleys', 2018, 23),
(79, 'Hollywood’s Bleeding', 2019, 23),
-- SZA (24)
(80, 'Ctrl', 2017, 24),
(81, 'SOS', 2022, 24),
-- Kendrick Lamar (25)
(82, 'Good Kid, M.A.A.D City', 2012, 25),
(83, 'To Pimp a Butterfly', 2015, 25),
(84, 'DAMN.', 2017, 25),
-- Harry Styles (26)
(85, 'Harry Styles', 2017, 26),
(86, 'Fine Line', 2019, 26),
(87, 'Harry’s House', 2022, 26),
-- Selena Gomez (27)
(88, 'Stars Dance', 2013, 27),
(89, 'Revival', 2015, 27),
(90, 'Rare', 2020, 27),
-- Red Velvet (28)
(91, 'The Red', 2015, 28),
(92, 'Perfect Velvet', 2017, 28),
(93, 'The ReVe Festival Finale', 2019, 28),
-- G-Dragon (29)
(94, 'Heartbreaker', 2009, 29),
(95, 'Coup dEtat', 2013, 29),
-- Alicia Keys (30)
(96, 'Songs in A Minor', 2001, 30),
(97, 'The Diary of Alicia Keys', 2003, 30),
(98, 'As I Am', 2007, 30),
(99, 'Girl on Fire', 2012, 30),
(100,'Alicia', 2020, 30);
SET IDENTITY_INSERT Albums OFF;

-- Genres
SET IDENTITY_INSERT Genres ON;
INSERT INTO Genres (ID, Name) VALUES 
(1, 'Pop'),
(2, 'Rock'),
(3, 'Hip Hop'),
(4, 'R&B'),
(5, 'Jazz'),
(6, 'Classical'),
(7, 'Electronic'),
(8, 'K-Pop'),
(9, 'Country'),
(10, 'Indie'),
(11, 'Metal'),
(12, 'Soul');
SET IDENTITY_INSERT Genres OFF;

-- Tracks
SET IDENTITY_INSERT Tracks ON;
INSERT INTO Tracks (ID, Title, Duration, Language, AlbumID, GenreID) VALUES
-- Album 1: Fearless (Pop)
(1, 'Fearless', 241, 'English', 1, 1),
(2, 'Love Story', 235, 'English', 1, 1),
(3, 'You Belong With Me', 231, 'English', 1, 1),
-- Album 2: Red
(4, 'State of Grace', 275, 'English', 2, 1),
(5, 'Red', 223, 'English', 2, 1),
(6, 'I Knew You Were Trouble', 219, 'English', 2, 1),
-- Album 3: 1989
(7, 'Welcome To New York', 212, 'English', 3, 1),
(8, 'Blank Space', 231, 'English', 3, 1),
(9, 'Shake It Off', 242, 'English', 3, 1),
-- Album 4: Reputation
(10, '...Ready For It?', 208, 'English', 4, 1),
(11, 'Delicate', 232, 'English', 4, 1),
(12, 'Look What You Made Me Do', 211, 'English', 4, 1),
-- Album 5: Plus
(13, 'The A Team', 258, 'English', 5, 1),
(14, 'Lego House', 185, 'English', 5, 1),
(15, 'Give Me Love', 285, 'English', 5, 1),
-- Album 6: Multiply
(16, 'Sing', 235, 'English', 6, 1),
(17, 'Don’t', 219, 'English', 6, 1),
(18, 'Thinking Out Loud', 281, 'English', 6, 1),
-- Album 7: Divide
(19,'Eraser', 227, 'English', 7, 1),
(20,'Castle On The Hill', 261, 'English', 7, 1),
(21,'Shape Of You', 233, 'English', 7, 1),
(22,'You’re My Best Friend', 170, 'English', 7, 2),
(23,'Love of My Life', 218, 'English', 7, 2),
-- Album 8: Equals
(24,'Bad Habits', 231, 'English', 8, 1),
(25,'Shivers', 207, 'English', 8, 1),
-- Album 9: 19
(26,'Daydreamer', 220, 'English', 9, 12),
(27,'Chasing Pavements', 210, 'English', 9, 12),
(28,'Make You Feel My Love', 213, 'English', 9, 12),
-- Album 10: 21
(29,'Rolling In The Deep', 228, 'English', 10, 12),
(30,'Someone Like You', 285, 'English', 10, 12),
(31,'Set Fire To The Rain', 242, 'English', 10, 12),
(32,'Come As You Are', 219, 'English', 10, 2),
-- Album 11: 25
(33,'Hello', 295, 'English', 11, 12),
(34,'Send My Love', 223, 'English', 11, 12),
(35,'When We Were Young', 289, 'English', 11, 12),
-- Album 12: 30
(36,'Easy On Me', 224, 'English', 12, 12),
(37,'Oh My God', 225, 'English', 12, 12),
-- Album 13: Take Care (Hip Hop)
(38,'Over My Dead Body', 272, 'English', 13, 3),
(39,'Headlines', 235, 'English', 13, 3),
(40,'Take Care', 277, 'English', 13, 3),
-- Album 14
(41,'Tuscan Leather', 366, 'English', 14, 3),
(42,'Started From The Bottom', 174, 'English', 14, 3),
(43,'Hold On We’re Going Home', 227, 'English', 14, 3),
-- Album 15
(44,'Keep The Family Close', 332, 'English', 15, 3),
(45,'One Dance', 173, 'English', 15, 3),
(46,'Hotline Bling', 267, 'English', 15, 3),
-- Album 16
(47,'Survival', 136, 'English', 16, 3),
(48,'Nonstop', 238, 'English', 16, 3),
(49,'In My Feelings', 217, 'English', 16, 3),
(50,'Paradise', 278, 'English', 16, 1),
(51,'Charlie Brown', 285, 'English', 16, 1),
-- Album 17: BTS
(52,'No More Dream', 222, 'Korean', 17, 8),
(53,'We Are Bulletproof Pt.2', 208, 'Korean', 17, 8),
(54,'N.O', 210, 'Korean', 17, 8),
(55,'Under the Bridge', 264, 'English', 17, 2),
-- Album 18
(56,'Blood Sweat & Tears', 215, 'Korean', 18, 8),
(57,'Lie', 234, 'Korean', 18, 8),
(58,'Awake', 213, 'Korean', 18, 8),
-- Album 19
(59,'Fake Love', 239, 'Korean', 19, 8),
(60,'The Truth Untold', 241, 'Korean', 19, 8),
(61,'Anpanman', 212, 'Korean', 19, 8),
-- Album 20
(62,'ON', 255, 'Korean', 20, 8),
(63,'Black Swan', 198, 'Korean', 20, 8),
(64,'Filter', 180, 'Korean', 20, 8),
-- Album 21: Billie Eilish
(65,'Bad Guy', 194, 'English', 21, 1),
(66,'When The Party’s Over', 196, 'English', 21, 1),
-- Album 22
(67,'Therefore I Am', 174, 'English', 22, 1),
(68,'Happier Than Ever', 298, 'English', 22, 1),
(303,'Your Power', 245, 'English', 22, 1),
-- Album 23: Bruno Mars
(69,'Grenade', 223, 'English', 23, 1),
(70,'Just The Way You Are', 220, 'English', 23, 1),
(71,'The Lazy Song', 189, 'English', 23, 1),
-- Album 24
(72,'Locked Out Of Heaven', 233, 'English', 24, 1),
(73,'When I Was Your Man', 214, 'English', 24, 1),
(74,'Treasure', 178, 'English', 24, 1),
-- Album 25
(75,'24K Magic', 226, 'English', 25, 1),
(76,'That’s What I Like', 206, 'English', 25, 1),
(77,'Versace On The Floor', 261, 'English', 25, 1),
-- Album 26: Blackpink
(78,'How You Like That', 181, 'Korean', 26, 8),
(79,'Lovesick Girls', 192, 'Korean', 26, 8),
(80,'Pretty Savage', 201, 'Korean', 26, 8),
-- Album 27
(81,'Pink Venom', 187, 'Korean', 27, 8),
(82,'Shut Down', 175, 'Korean', 27, 8),
(83,'Typa Girl', 179, 'Korean', 27, 8),
-- Album 28: The Weeknd
(84,'Professional', 242, 'English', 28, 4),
(85,'The Town', 300, 'English', 28, 4),
(86,'Wanderlust', 305, 'English', 28, 4),
-- Album 29
(87,'Can’t Feel My Face', 215, 'English', 29, 4),
(88,'The Hills', 242, 'English', 29, 4),
(89,'Earned It', 276, 'English', 29, 4),
-- Album 30
(90,'Starboy', 230, 'English', 30, 4),
(91,'Reminder', 218, 'English', 30, 4),
(92,'I Feel It Coming', 269, 'English', 30, 4),
-- Album 31
(93,'Alone Again', 252, 'English', 31, 4),
(94,'Blinding Lights', 200, 'English', 31, 4),
(95,'Save Your Tears', 215, 'English', 31, 4),
-- Album 32: Ariana Grande
(96,'Honeymoon Avenue', 220, 'English', 32, 1),
(97,'Baby I', 197, 'English', 32, 1),
-- Album 33
(98,'Moonlight', 203, 'English', 33, 1),
(99,'Dangerous Woman', 235, 'English', 33, 1),
(100,'Into You', 244, 'English', 33, 1),
(101,'Under the Bridge', 264, 'English', 17, 2),
-- Album 34
(102,'Raindrops', 37, 'English', 34, 1),
(103,'No Tears Left To Cry', 205, 'English', 34, 1),
(104,'God Is A Woman', 197, 'English', 34, 1),
-- Album 35
(105,'Imagine', 212, 'English', 35, 1),
(106,'7 Rings', 178, 'English', 35, 1),
(107,'Thank U, Next', 207, 'English', 35, 1),
-- Album 36: Coldplay
(108,'Don’t Panic', 137, 'English', 36, 2),
(109,'Yellow', 269, 'English', 36, 2),
(110,'Trouble', 269, 'English', 36, 2),
-- Album 37
(111,'Clocks', 307, 'English', 37, 2),
(112,'The Scientist', 309, 'English', 37, 2),
(113,'In My Place', 229, 'English', 37, 2),
-- Album 38
(114,'Viva La Vida', 242, 'English', 38, 2),
(115,'Lost!', 236, 'English', 38, 2),
(116,'Strawberry Swing', 249, 'English', 38, 2),
-- Album 39
(117,'Higher Power', 203, 'English', 39, 7),
(118,'My Universe', 226, 'English', 39, 7),
(119,'Coloratura', 634, 'English', 39, 7),
-- Album 40: Imagine Dragons
(120,'Radioactive', 186, 'English', 40, 2),
(121,'Demons', 177, 'English', 40, 2),
(122,'On Top Of The World', 192, 'English', 40, 2);
INSERT INTO Tracks (ID,Title, Duration, Language, AlbumID, GenreID) VALUES
-- Album 41: Smoke + Mirrors (Imagine Dragons)
(123,'Shots', 232, 'English', 41, 2),
(124,'Gold', 216, 'English', 41, 2),
(125,'I Bet My Life', 193, 'English', 41, 2),
-- Album 42: Evolve
(126,'Next To Me', 230, 'English', 42, 2),
(127,'Believer', 204, 'English', 42, 2),
-- Album 43: Mercury – Act 1
(128,'Enemy', 173, 'English', 43, 2),
(129,'Wrecked', 242, 'English', 43, 2),
(130,'Follow You', 175, 'English', 43, 2),
-- Album 44: Handwritten (Shawn Mendes)
(131,'Life Of The Party', 214, 'English', 44, 1),
(132,'Stitches', 206, 'English', 44, 1),
(133,'Something Big', 161, 'English', 44, 1),
-- Album 45: Illuminate
(134,'Ruin', 231, 'English', 45, 1),
(135,'Treat You Better', 187, 'English', 45, 1),
(136,'Mercy', 208, 'English', 45, 1),
-- Album 46: Wonder
(137,'Wonder', 172, 'English', 46, 1),
(138,'Monster', 178, 'English', 46, 1),
(139,'Call My Friends', 151, 'English', 46, 1),
-- Album 47: My World 2.0 (Justin Bieber)
(140,'Baby', 214, 'English', 47, 1),
(141,'Somebody To Love', 220, 'English', 47, 1),
(142,'U Smile', 196, 'English', 47, 1),
-- Album 48: Purpose
(143,'Mark My Words', 134, 'English', 48, 1),
(144,'Sorry', 200, 'English', 48, 1),
(145,'Love Yourself', 233, 'English', 48, 1),
-- Album 49: Justice
(146,'Holy', 212, 'English', 49, 1),
(147,'Peaches', 198, 'English', 49, 1),
(148,'Ghost', 153, 'English', 49, 1),
-- Album 50: Palette (IU)
(149,'Palette', 217, 'Korean', 50, 8),
(150,'Through The Night', 256, 'Korean', 50, 8),
(151,'Jam Jam', 195, 'Korean', 50, 8),
-- Album 51: Love Poem
(152,'Unlucky', 201, 'Korean', 51, 8),
(153,'Love Poem', 243, 'Korean', 51, 8),
(154,'Blueming', 217, 'Korean', 51, 8),
-- Album 52: Lilac
(155,'Lilac', 214, 'Korean', 52, 8),
(156,'Celebrity', 195, 'Korean', 52, 8),
(157,'Coin', 183, 'Korean', 52, 8),
(158,'High Hopes', 190, 'English', 52, 1),
-- Album 53: Nine Track Mind (Charlie Puth)
(159,'One Call Away', 194, 'English', 53, 1),
(160,'We Don’t Talk Anymore', 217, 'English', 53, 1),
(161,'Marvin Gaye', 189, 'English', 53, 1),
-- Album 54: Voicenotes
(162,'Attention', 211, 'English', 54, 1),
(163,'How Long', 200, 'English', 54, 1),
(164,'Done For Me', 180, 'English', 54, 1),
-- Album 55: Charlie
(165,'Light Switch', 185, 'English', 55, 1),
(166,'Left And Right', 154, 'English', 55, 1),
(167,'That’s Hilarious', 167, 'English', 55, 1),
-- Album 56: Songs About Jane (Maroon 5)
(168,'Harder To Breathe', 173, 'English', 56, 2),
(169,'This Love', 206, 'English', 56, 2),
(170,'She Will Be Loved', 257, 'English', 56, 2),
-- Album 57
(171,'Makes Me Wonder', 192, 'English', 57, 2),
(172,'Wake Up Call', 202, 'English', 57, 2),
(173,'Won’t Go Home Without You', 230, 'English', 57, 2),
-- Album 58
(174,'Payphone', 231, 'English', 58, 2),
(175,'One More Night', 220, 'English', 58, 2),
(176,'Daylight', 226, 'English', 58, 2),
-- Album 59
(177,'Memories', 189, 'English', 59, 2),
(178,'Nobody’s Love', 211, 'English', 59, 2),
(179,'Lost', 171, 'English', 59, 2),
-- Album 60: Music Of The Sun (Rihanna)
(180,'Pon De Replay', 246, 'English', 60, 4),
(181,'If It’s Lovin’ That You Want', 211, 'English', 60, 4),
(182,'Let Me', 195, 'English', 60, 4),
-- Album 61
(183,'Umbrella', 262, 'English', 61, 4),
(184,'Shut Up And Drive', 213, 'English', 61, 4),
(185,'Don’t Stop The Music', 267, 'English', 61, 4),
-- Album 62
(186,'Only Girl', 235, 'English', 62, 4),
(187,'What’s My Name', 262, 'English', 62, 4),
(188,'S&M', 244, 'English', 62, 4),
-- Album 63
(189,'Work', 219, 'English', 63, 4),
(190,'Needed Me', 191, 'English', 63, 4),
(191,'Love On The Brain', 224, 'English', 63, 4),
-- Album 64: Slim Shady LP (Eminem)
(192,'My Name Is', 268, 'English', 64, 3),
(193,'Guilty Conscience', 199, 'English', 64, 3),
(194,'Role Model', 204, 'English', 64, 3),
-- Album 65
(195,'The Real Slim Shady', 284, 'English', 65, 3),
(196,'Stan', 404, 'English', 65, 3),
(197,'The Way I Am', 290, 'English', 65, 3),
-- Album 66
(198,'Not Afraid', 248, 'English', 66, 3),
(199,'Love The Way You Lie', 263, 'English', 66, 3),
(200,'No Love', 299, 'English', 66, 3),
-- Album 67
(201,'Godzilla', 210, 'English', 67, 3),
(202,'Darkness', 337, 'English', 67, 3),
(203,'Lose Yourself', 326, 'English', 67, 3),
-- Album 68: The Fame (Lady Gaga)
(204,'Just Dance', 241, 'English', 68, 1),
(205,'Poker Face', 237, 'English', 68, 1),
(206,'Paparazzi', 208, 'English', 68, 1),
-- Album 69
(207,'Born This Way', 260, 'English', 69, 1),
(208,'Judas', 249, 'English', 69, 1),
(209,'The Edge Of Glory', 320, 'English', 69, 1),
-- Album 70
(210,'Perfect Illusion', 182, 'English', 70, 1),
(211,'Million Reasons', 205, 'English', 70, 1),
(212,'Joanne', 210, 'English', 70, 1)
INSERT INTO Tracks (ID,Title, Duration, Language, AlbumID, GenreID) VALUES
-- Album 71: Chromatica (Lady Gaga)
(213,'Chromatica I', 60, 'English', 71, 7),
(214,'Rain On Me', 182, 'English', 71, 7),
(215,'Stupid Love', 193, 'English', 71, 7),
-- Album 72: In The Lonely Hour (Sam Smith)
(216,'Stay With Me', 172, 'English', 72, 12),
(217,'I’m Not The Only One', 239, 'English', 72, 12),
(218,'Lay Me Down', 253, 'English', 72, 12),
-- Album 73
(219,'Too Good At Goodbyes', 201, 'English', 73, 12),
(220,'Pray', 221, 'English', 73, 12),
(221,'HIM', 214, 'English', 73, 12),
-- Album 74
(222,'Unholy', 156, 'English', 74, 1),
(223,'Love Me More', 210, 'English', 74, 1),
(224,'Gloria', 215, 'English', 74, 1),
-- Album 75: Dua Lipa
(225,'Be The One', 202, 'English', 75, 1),
(226,'IDGAF', 217, 'English', 75, 1),
(227,'New Rules', 209, 'English', 75, 1),
-- Album 76
(228,'Don’t Start Now', 183, 'English', 76, 1),
(229,'Physical', 193, 'English', 76, 1),
(230,'Levitating', 203, 'English', 76, 1),
-- Album 77: Stoney (Post Malone)
(231,'White Iverson', 256, 'English', 77, 3),
(232,'Congratulations', 220, 'English', 77, 3),
(233,'Go Flex', 179, 'English', 77, 3),
-- Album 78
(234,'Rockstar', 218, 'English', 78, 3),
(235,'Psycho', 221, 'English', 78, 3),
-- Album 79
(236,'Circles', 215, 'English', 79, 3),
(237,'Sunflower', 158, 'English', 79, 3),
(238,'Wow.', 149, 'English', 79, 3),
(239,'Take What You Want', 231, 'English', 79, 3),
(240,'Goodbyes', 174, 'English', 79, 3),
-- Album 80: Ctrl (SZA)
(241,'Supermodel', 181, 'English', 80, 4),
(242,'Love Galore', 215, 'English', 80, 4),
(243,'The Weekend', 272, 'English', 80, 4),
-- Album 81
(244,'Good Days', 279, 'English', 81, 4),
(245,'Kill Bill', 153, 'English', 81, 4),
(246,'Snooze', 201, 'English', 81, 4),
-- Album 82: Good Kid, M.A.A.D City (Kendrick Lamar)
(247,'Sherane', 273, 'English', 82, 3),
(248,'Bitch Don’t Kill My Vibe', 310, 'English', 82, 3),
(249,'Swimming Pools', 313, 'English', 82, 3),
-- Album 83
(250,'Wesley’s Theory', 287, 'English', 83, 3),
(251,'King Kunta', 234, 'English', 83, 3),
(252,'Alright', 219, 'English', 83, 3),
-- Album 84
(253,'DNA.', 185, 'English', 84, 3),
(254,'HUMBLE.', 177, 'English', 84, 3),
(255,'LOVE.', 214, 'English', 84, 3),
-- Album 85: Harry Styles
(256,'Sign Of The Times', 341, 'English', 85, 2),
(257,'Kiwi', 174, 'English', 85, 2),
(258,'Sweet Creature', 224, 'English', 85, 2),
-- Album 86
(259,'Lights Up', 172, 'English', 86, 2),
(260,'Adore You', 207, 'English', 86, 2),
(261,'Watermelon Sugar', 174, 'English', 86, 2),
-- Album 87
(262,'As It Was', 167, 'English', 87, 2),
(263,'Late Night Talking', 178, 'English', 87, 2),
(264,'Music For A Sushi Restaurant', 194, 'English', 87, 2),
-- Album 88: Stars Dance (Selena Gomez)
(265,'Birthday', 198, 'English', 88, 1),
(266,'Slow Down', 211, 'English', 88, 1),
(267,'Come & Get It', 231, 'English', 88, 1),
-- Album 89
(268,'Good For You', 221, 'English', 89, 1),
(269,'Hands To Myself', 201, 'English', 89, 1),
(270,'Same Old Love', 229, 'English', 89, 1),
-- Album 90
(271,'Lose You To Love Me', 206, 'English', 90, 1),
(272,'Look At Her Now', 162, 'English', 90, 1),
(273,'Rare', 220, 'English', 90, 1),
-- Album 91: The Red (Red Velvet)
(274,'Dumb Dumb', 203, 'Korean', 91, 8),
(275,'Huff n Puff', 210, 'Korean', 91, 8),
(276,'Oh Boy', 214, 'Korean', 91, 8),
-- Album 92
(277,'Peek-A-Boo', 199, 'Korean', 92, 8),
(278,'Bad Boy', 210, 'Korean', 92, 8),
(279,'Kingdom Come', 224, 'Korean', 92, 8),
-- Album 93
(280,'Psycho', 210, 'Korean', 93, 8),
(281,'In & Out', 190, 'Korean', 93, 8),
(282,'Remember Forever', 223, 'Korean', 93, 8),
-- Album 94: Heartbreaker (G-Dragon)
(283,'Heartbreaker', 222, 'Korean', 94, 8),
(284,'Breathe', 203, 'Korean', 94, 8),
(285,'A Boy', 216, 'Korean', 94, 8),
-- Album 95
(286,'Crooked', 224, 'Korean', 95, 8),
(287,'Who You?', 208, 'Korean', 95, 8),
(288,'Black', 233, 'Korean', 95, 8),
-- Album 96: Songs In A Minor (Alicia Keys)
(289,'Fallin’', 210, 'English', 96, 12),
(290,'A Woman’s Worth', 290, 'English', 96, 12),
(291,'How Come You Don’t Call Me', 220, 'English', 96, 12),
-- Album 97
(292,'You Don’t Know My Name', 366, 'English', 97, 12),
(293,'If I Ain’t Got You', 228, 'English', 97, 12),
-- Album 98
(294,'No One', 252, 'English', 98, 12),
(295,'Like You’ll Never See Me Again', 315, 'English', 98, 12),
(296,'Superwoman', 274, 'English', 98, 12),
-- Album 99
(297,'Girl On Fire', 269, 'English', 99, 12),
(298,'New Day', 203, 'English', 99, 12),
(299,'Brand New Me', 222, 'English', 99, 12),
-- Album 100
(300,'Underdog', 208, 'English', 100, 12),
(301,'Time Machine', 227, 'English', 100, 12),
(302,'Show Me Love', 214, 'English', 100, 12);
SET IDENTITY_INSERT Tracks OFF;

-- Users
SET IDENTITY_INSERT Users ON
INSERT INTO Users (ID,Username, Email, SubscriptionType, RegistrationDate) VALUES
(1,'alexm', 'alex.morgan@email.com', 'Premium', '2023-01-15'),
(2,'sarah_k', 'sarah.kim@email.com', 'Free', '2023-02-03'),
(3,'mike_92', 'mike92@email.com', 'Free', '2023-02-18'),
(4,'emma_w', 'emma.wilson@email.com', 'Premium', '2023-03-01'),
(5,'li_wei', 'li.wei@email.com', 'Free', '2023-03-12'),
(6,'carlos_7', 'carlos.g@email.com', 'Premium', '2023-03-25'),
(7,'amina_h', 'amina.h@email.com', 'Free', '2023-04-02'),
(8,'daniel_r', 'daniel.r@email.com', 'Premium', '2023-04-18'),
(9,'sofia_l', 'sofia.lopez@email.com', 'Free', '2023-05-05'),
(10,'samuel_w', 'samuel.w@email.com', 'Premium', '2024-03-18'),
(11,'noah_b', 'noah.b@email.com', 'Premium', '2023-05-22'),
(12,'olivia_j', 'olivia.j@email.com', 'Free', '2023-06-01'),
(13,'lucas_m', 'lucas.m@email.com', 'Premium', '2023-06-14'),
(14,'fatima_z', 'fatima.z@email.com', 'Free', '2023-07-03'),
(15,'ethan_p', 'ethan.p@email.com', 'Premium', '2023-07-19'),
(16,'mia_t', 'mia.t@email.com', 'Free', '2023-08-07'),
(17,'ryan_s', 'ryan.s@email.com', 'Premium', '2023-08-20'),
(18,'hannah_c', 'hannah.c@email.com', 'Free', '2023-09-02'),
(19,'youssef_a', 'youssef.a@email.com', 'Premium', '2023-09-15'),
(20,'isabella_d', 'isabella.d@email.com', 'Free', '2023-10-01'),
(21,'jack_l', 'jack.l@email.com', 'Premium', '2023-10-18'),
(22,'chloe_v', 'chloe.v@email.com', 'Free', '2023-11-04'),
(23,'ahmed_k', 'ahmed.k@email.com', 'Premium', '2023-11-20'),
(24,'grace_n', 'grace.n@email.com', 'Free', '2023-12-01'),
(25,'leo_f', 'leo.f@email.com', 'Premium', '2023-12-15'),
(26,'nora_e', 'nora.e@email.com', 'Free', '2024-01-05'),
(27,'omar_h', 'omar.h@email.com', 'Premium', '2024-01-19'),
(28,'ella_m', 'ella.m@email.com', 'Free', '2024-02-02'),
(29,'adam_t', 'adam.t@email.com', 'Premium', '2024-02-16'),
(30,'zara_s', 'zara.s@email.com', 'Free', '2024-03-01');
SET IDENTITY_INSERT Users OFF

-- playlists
SET IDENTITY_INSERT Playlists ON
INSERT INTO Playlists (ID, Title, UserID, CreatedAt) VALUES-- User 1
(1, 'Chill Vibes', 1, '2023-02-01'),
(2, 'Workout Hits', 1, '2023-03-10'),
-- User 2
(3, 'K-Pop Favorites', 2, '2023-02-15'),
(4, 'Late Night Songs', 2, '2023-04-01'),
-- User 3
(5, 'Road Trip', 3, '2023-03-01'),
(6, 'Old Classics', 3, '2023-05-12'),
-- User 4
(7, 'Focus Mode', 4, '2023-03-20'),
(8, 'Pop Essentials', 4, '2023-04-25'),
-- User 5
(9, 'Mandarin Hits', 5, '2023-04-01'),
(10, 'Relaxing Piano', 5, '2023-06-02'),
-- User 6
(11, 'Spanish Party', 6, '2023-04-10'),
(12, 'Summer 2023', 6, '2023-06-15'),
-- User 7
(13, 'Arabic Mix', 7, '2023-04-20'),
(14, 'Deep Thoughts', 7, '2023-07-01'),
-- User 8
(15, 'Rock Legends', 8, '2023-05-01'),
(16, 'Gym Power', 8, '2023-07-18'),
-- User 9
(17, 'Latin Heat', 9, '2023-05-15'),
(18, 'Love Songs', 9, '2023-08-01'),
-- User 10
(19, 'US Top Hits', 10, '2024-06-01'),
(20, 'Throwbacks', 10, '2024-09-12'),
-- User 11
(21, 'Aussie Chill', 11, '2023-06-20'),
(22, 'Indie Mix', 11, '2023-09-25'),
-- User 12
(23, 'Brazilian Beats', 12, '2023-07-01'),
(24, 'Party Time', 12, '2023-10-05'),
-- User 13
(25, 'Desert Nights', 13, '2023-07-15'),
(26, 'Soft Pop', 13, '2023-11-01'),
-- User 14
(27, 'Morning Energy', 14, '2023-08-01'),
(28, 'Hip Hop Vibes', 14, '2023-11-20'),
-- User 15
(29, 'Italian Classics', 15, '2023-08-15'),
(30, 'Acoustic Mood', 15, '2023-12-05'),
-- User 16 (3 playlists)
(31, 'Irish Folk', 16, '2023-09-01'),
(32, 'Rainy Days', 16, '2023-12-15'),
(33, 'Top 2024', 16, '2024-02-01'),
-- User 17
(34, 'UK Charts', 17, '2023-09-20'),
(35, 'Sad Songs', 17, '2024-01-10'),
(36, 'Dance Floor', 17, '2024-03-01'),
-- User 18
(37, 'Egyptian Mix', 18, '2023-10-01'),
(38, 'Romantic Arabic', 18, '2024-01-25'),
(39, 'Weekend Hits', 18, '2024-03-15'),
-- User 19
(40, 'Argentina Rock', 19, '2023-10-15'),
(41, 'Chill Nights', 19, '2024-02-01'),
(42, 'Gym Playlist', 19, '2024-03-20'),
-- User 20
(43, 'USA Party', 20, '2023-11-01'),
(44, 'Study Mode', 20, '2024-01-15'),
(45, 'Classic Pop', 20, '2024-03-25'),
-- User 21
(46, 'French Hits', 21, '2023-11-15'),
(47, 'Soft Rock', 21, '2024-02-10'),
(48, 'Travel Songs', 21, '2024-03-30'),
-- User 22
(49, 'Saudi Beats', 22, '2023-12-01'),
(50, 'Top Arabic 2024', 22, '2024-02-20'),
(51, 'Night Drive', 22, '2024-04-01'),
-- User 23
(52, 'NZ Chill', 23, '2023-12-20'),
(53, 'Indie Rock', 23, '2024-03-01'),
(54, 'Workout Mix', 23, '2024-04-10'),
-- User 24
(55, 'German Pop', 24, '2024-01-01'),
(56, 'Electro Party', 24, '2024-03-10'),
(57, 'Focus Beats', 24, '2024-04-15'),
-- User 25
(58, 'Nordic Calm', 25, '2024-01-15'),
(59, 'Winter Mood', 25, '2024-03-20'),
(60, 'Top Charts', 25, '2024-04-20'),
-- User 26
(61, 'Jordan Hits', 26, '2024-02-01'),
(62, 'Deep House', 26, '2024-03-25'),
(63, 'Morning Chill', 26, '2024-04-25'),
-- User 27
(64, 'US Indie', 27, '2024-02-10'),
(65, 'Love Mix', 27, '2024-03-30'),
(66, 'Dance Hits', 27, '2024-04-28'),
-- User 28
(67, 'Polish Vibes', 28, '2024-02-20'),
(68, 'Rock Mix', 28, '2024-04-01'),
(69, 'Evening Relax', 28, '2024-05-01'),
-- User 29
(70, 'Bollywood Mix', 29, '2024-03-01'),
(71, 'India Top 50', 29, '2024-04-10'),
(72, 'Chill India', 29, '2024-05-05'),
-- User 30
(73, 'Canada Chill', 30, '2024-03-15'),
(74, 'Hip Hop Canada', 30, '2024-04-15'),
(75, 'Summer 2024', 30, '2024-05-10');
SET IDENTITY_INSERT Playlists OFF
-- PlaylistTracks
INSERT INTO PlaylistTracks (PlaylistID, TrackID, AddedDate) VALUES
-- Playlists 1–75 (4 tracks each)
(1,1,'2023-02-02'),(1,25,'2023-02-02'),(1,50,'2023-02-03'),(1,75,'2023-02-04'),
(2,2,'2023-03-11'),(2,26,'2023-03-11'),(2,51,'2023-03-12'),(2,76,'2023-03-13'),
(3,3,'2023-02-16'),(3,27,'2023-02-16'),(3,52,'2023-02-17'),
(4,4,'2023-04-02'),(4,28,'2023-04-02'),(4,53,'2023-04-03'),(4,78,'2023-04-04'),
(5,5,'2023-03-02'),(5,29,'2023-03-02'),(5,54,'2023-03-03'),(5,79,'2023-03-04'),
(6,6,'2023-05-13'),(6,30,'2023-05-13'),(6,55,'2023-05-14'),(6,80,'2023-05-15'),
(7,7,'2023-03-21'),(7,31,'2023-03-21'),(7,56,'2023-03-22'),(7,81,'2023-03-23'),
(8,8,'2023-04-26'),(8,32,'2023-04-26'),(8,57,'2023-04-27'),(8,82,'2023-04-28'),
(9,9,'2023-04-02'),(9,33,'2023-04-02'),(9,58,'2023-04-03'),(9,83,'2023-04-04'),
(10,10,'2023-06-03'),(10,34,'2023-06-03'),(10,59,'2023-06-04'),(10,84,'2023-06-05'),

(11,11,'2023-04-11'),(11,35,'2023-04-11'),(11,60,'2023-04-12'),(11,85,'2023-04-13'),
(12,12,'2023-06-16'),(12,36,'2023-06-16'),(12,61,'2023-06-17'),(12,86,'2023-06-18'),
(13,13,'2023-04-21'),(13,37,'2023-04-21'),(13,62,'2023-04-22'),
(14,14,'2023-07-02'),(14,38,'2023-07-02'),(14,63,'2023-07-03'),(14,88,'2023-07-04'),
(15,15,'2023-05-02'),(15,39,'2023-05-02'),(15,64,'2023-05-03'),(15,89,'2023-05-04'),
(16,16,'2023-09-02'),(16,40,'2023-09-02'),(16,65,'2023-09-03'),(16,90,'2023-09-04'),
(17,17,'2023-09-21'),(17,41,'2023-09-21'),(17,66,'2023-09-22'),(17,91,'2023-09-23'),
(18,18,'2023-10-02'),(18,42,'2023-10-02'),
(19,19,'2024-10-16'),(19,43,'2024-10-16'),(19,68,'2024-10-17'),(19,93,'2024-10-18'),
(20,20,'2024-11-02'),(20,44,'2024-11-02'),(20,69,'2024-11-03'),(20,94,'2024-11-04'),

(21,21,'2023-11-16'),(21,45,'2023-11-16'),(21,70,'2023-11-17'),(21,95,'2023-11-18'),
(22,22,'2023-12-02'),(22,46,'2023-12-02'),(22,71,'2023-12-03'),(22,96,'2023-12-04'),
(23,23,'2023-12-21'),(23,47,'2023-12-21'),
(24,24,'2024-01-02'),(24,48,'2024-01-02'),(24,73,'2024-01-03'),(24,98,'2024-01-04'),
(25,25,'2024-01-16'),(25,49,'2024-01-16'),(25,74,'2024-01-17'),(25,99,'2024-01-18'),

(26,26,'2024-01-20'),(26,76,'2024-01-20'),(26,126,'2024-01-21'),(26,176,'2024-01-22'),
(27,27,'2024-02-02'),(27,77,'2024-02-02'),(27,127,'2024-02-03'),(27,177,'2024-02-04'),
(28,28,'2024-02-17'),(28,78,'2024-02-17'),(28,128,'2024-02-18'),(28,178,'2024-02-19'),
(29,29,'2024-03-02'),(29,79,'2024-03-02'),(29,129,'2024-03-03'),(29,179,'2024-03-04'),
(30,30,'2024-03-19'),(30,80,'2024-03-19'),(30,130,'2024-03-20'),(30,180,'2024-03-21'),

(31,31,'2024-02-02'),(31,81,'2024-02-02'),(31,131,'2024-02-03'),(31,181,'2024-02-04'),
(32,32,'2024-02-16'),(32,82,'2024-02-16'),(32,132,'2024-02-17'),(32,182,'2024-02-18'),
(33,33,'2024-02-02'),(33,83,'2024-02-02'),(33,133,'2024-02-03'),
(34,34,'2024-03-02'),(34,84,'2024-03-02'),(34,134,'2024-03-03'),(34,184,'2024-03-04'),
(35,35,'2024-03-12'),(35,85,'2024-03-12'),(35,135,'2024-03-13'),(35,185,'2024-03-14'),(35,125,'2025-03-15'),(35,140,'2025-03-16'),

(36,36,'2024-03-02'),(36,86,'2024-03-02'),(36,136,'2024-03-03'),(36,186,'2024-03-04'),
(37,37,'2024-03-16'),(37,87,'2024-03-16'),(37,137,'2024-03-17'),(37,187,'2024-03-18'),
(38,38,'2024-03-26'),(38,88,'2024-03-26'),
(40,40,'2024-02-02'),(40,90,'2024-02-02'),(40,140,'2024-02-03'),(40,190,'2024-02-04'),

(41,41,'2024-02-12'),(41,91,'2024-02-12'),(41,141,'2024-02-13'),
(42,42,'2024-03-22'),(42,92,'2024-03-22'),(42,142,'2024-03-23'),(42,192,'2024-03-24'),(42,200,'2024-07-24'),(42,207,'2024-08-12'),
(43,43,'2024-01-16'),(43,93,'2024-01-16'),(43,143,'2024-01-17'),
(44,44,'2024-01-16'),(44,94,'2024-01-16'),(44,144,'2024-01-17'),(44,194,'2024-01-18'),

(46,46,'2024-02-11'),(46,96,'2024-02-11'),(46,146,'2024-02-12'),(46,196,'2024-02-13'),
(47,47,'2024-03-01'),(47,97,'2024-03-01'),(47,147,'2024-03-02'),(47,197,'2024-03-03'),
(48,48,'2024-03-31'),(48,98,'2024-03-31'),
(49,49,'2024-02-21'),(49,99,'2024-02-21'),(49,149,'2024-02-22'),(49,199,'2024-02-23'),
(50,50,'2024-02-21'),(50,100,'2024-02-21'),(50,150,'2024-02-22'),(50,200,'2024-02-23'),

(51,51,'2024-04-02'),(51,101,'2024-04-02'),(51,151,'2024-04-03'),(51,201,'2024-04-04'),
(52,52,'2024-03-02'),(52,102,'2024-03-02'),(52,152,'2024-03-03'),(52,202,'2024-03-04'),
(53,53,'2024-04-11'),(53,103,'2024-04-11'),(53,153,'2024-04-12'),(53,203,'2024-04-13'),
(54,54,'2024-04-11'),(54,104,'2024-04-11'),(54,154,'2024-04-12'),(54,204,'2024-04-13'),
(55,55,'2024-04-16'),(55,105,'2024-04-16'),(55,155,'2024-04-17'),(55,205,'2024-04-18'),

(56,56,'2024-03-11'),(56,106,'2024-03-11'),(56,156,'2024-03-12'),(56,206,'2024-03-13'),
(57,57,'2024-04-16'),(57,107,'2024-04-16'),(57,157,'2024-04-17'),(57,207,'2024-04-18'),
(58,58,'2024-03-21'),(58,108,'2024-03-21'),(58,158,'2024-03-22'),(58,208,'2024-03-23'),
(59,59,'2024-04-21'),(59,109,'2024-04-21'),(59,159,'2024-04-22'),(59,209,'2024-04-23'),
(60,60,'2024-04-21'),(60,110,'2024-04-21'),(60,160,'2024-04-22'),(60,210,'2024-04-23'),

(61,61,'2024-04-26'),(61,111,'2024-04-26'),(61,161,'2024-04-27'),(61,211,'2024-04-28'),
(62,62,'2024-04-26'),(62,112,'2024-04-26'),(62,162,'2024-04-27'),(62,212,'2024-04-28'),
(63,63,'2024-04-26'),(63,113,'2024-04-26'),(63,163,'2024-04-27'),(63,213,'2024-04-28'),
(64,64,'2024-04-29'),(64,114,'2024-04-29'),(64,164,'2024-04-30'),(64,214,'2024-05-01'),
(65,65,'2024-04-29'),(65,115,'2024-04-29'),(65,165,'2024-04-30'),(65,215,'2024-05-01'),

(66,66,'2024-04-29'),(66,116,'2024-04-29'),(66,166,'2024-04-30'),(66,216,'2024-05-01'),
(67,67,'2024-05-02'),(67,117,'2024-05-02'),(67,167,'2024-05-03'),(67,217,'2024-05-04'),
(68,68,'2024-05-02'),(68,118,'2024-05-02'),(68,168,'2024-05-03'),(68,218,'2024-05-04'),
(69,69,'2024-05-02'),(69,119,'2024-05-02'),(69,169,'2024-05-03'),(69,219,'2024-05-04'),
(70,70,'2024-05-06'),(70,120,'2024-05-06'),(70,170,'2024-05-07'),(70,220,'2024-05-08'),

(71,71,'2024-05-06'),(71,121,'2024-05-06'),(71,171,'2024-05-07'),(71,221,'2024-05-08'),
(72,72,'2024-05-06'),(72,122,'2024-05-06'),(72,172,'2024-05-07'),(72,222,'2024-05-08'),
(73,73,'2024-05-11'),(73,123,'2024-05-11'),(73,173,'2024-05-12'),(73,223,'2024-05-13'),
(74,74,'2024-05-11'),(74,124,'2024-05-11'),(74,174,'2024-05-12'),(74,224,'2024-05-13'),
(75,150,'2024-05-11'),(75,175,'2024-05-11'),(75,200,'2024-05-12'),(75,225,'2024-05-13');
`;
