drop database if exists schoolapp;
create database schoolapp;
use schoolapp;

CREATE TABLE user (
    id int not null auto_increment,
    name varchar(255),
    password varchar(255),
    username varchar(255),
    type varchar(255),
    create_time datetime default current_timestamp,
    last_login datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE parent_student (
    parent_id int,
    student_id int
);

CREATE TABLE message (
    id int not null auto_increment,
    content varchar(1000),
    status varchar(255),
    sender_id int,
    receiver_id int,
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE bulletin (
    id int not null auto_increment,
    title varchar(255),
    content varchar(1000),
    sender_id int,
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE bulletin_receiver (
    id int not null auto_increment,
    bulletin_id int,
    course_id int,
    primary key (id)
);

CREATE TABLE bulletin_user (
    id int not null auto_increment,
    bulletin_id int,
    user_id int,
    status varchar(255),
    primary key (id)
);

CREATE TABLE course (
    id int not null auto_increment,
    name varchar(255),
    description varchar(255),
    location varchar(255),
    start_date date,
    end_date date,
    teacher_id int,
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE course_student (
    id int not null auto_increment,
    course_id int,
    student_id int,
    primary key (id)
);

CREATE TABLE course_grade (
    id int not null auto_increment,
    course_id int,
    student_id int,
    grade int,
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE lesson (
    id int not null auto_increment,
    course_id int,
    day varchar(255),
    week date,
    start_time int,
    end_time int,
    primary key (id)
);

CREATE TABLE exam (
    id int not null auto_increment,
    course_id int,
    student_id int,
    name varchar(255),
    grade int,
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE homework (
    id int not null auto_increment,
    course_id int,
    name varchar(255),
    description varchar(255),
    deadline date default null,
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE homework_file (
    id int not null auto_increment,
    homework_id int,
    homework_answer_id int,
    name varchar(255),
    resource varchar(255),
    mimetype varchar(255),
    primary key (id)
);

CREATE TABLE homework_answer (
    id int not null auto_increment,
    homework_id int,
    student_id int,
    content varchar(255),
    done tinyint,
    grade int,
    comment varchar(255),
    create_time datetime default current_timestamp,
    primary key (id)
);

CREATE TABLE attendance (
    id int not null auto_increment,
    lesson_id int,
    student_id int,
    status varchar(255),
    primary key (id)
);
