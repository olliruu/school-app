
INSERT INTO user (name, username, password, type) values ("test teacher", "tt", "test", "teacher");
INSERT INTO user (name, username, password, type) values ("Mathias Tangaroa", "mathias", "password1", "teacher");

INSERT INTO user (name, username, password, type) values ("test parent", "tp", "test", "parent");
INSERT INTO user (name, username, password, type) values ("Deniss Iafeth", "deniss", "deniss", "parent");
INSERT INTO user (name, username, password, type) values ("Arnold Damhan", "arnold", "arnold", "parent");
INSERT INTO user (name, username, password, type) values ("Haven Foster", "haven", "haven", "parent");

INSERT INTO user (name, username, password, type) values ("Hermogenes Radim", "hermogenes", "test", "student");
INSERT INTO user (name, username, password, type) values ("Mwangi Vitislav", "mwangi", "test", "student");
INSERT INTO user (name, username, password, type) values ("Patrick Durai", "patrick", "test", "student");
INSERT INTO user (name, username, password, type) values ("Ben Durai", "ben", "test", "student");
INSERT INTO user (name, username, password, type) values ("Mikita Ifa", "mikita", "test", "student");
INSERT INTO user (name, username, password, type) values ("Baldwin Tarik", "baldwin", "test", "student");

INSERT INTO parent_student values (3,9);
INSERT INTO parent_student values (3,10);
INSERT INTO parent_student values (4,7);
INSERT INTO parent_student values (5,8);
INSERT INTO parent_student values (6,11);
INSERT INTO parent_student values (6,12);

INSERT INTO message (content, status, sender_id, receiver_id) values ("Lorem ipsum dolor sit amet, consectetur adipiscing elit.", "new", 1, 2);
INSERT INTO message (content, status, sender_id, receiver_id) values ("Fusce rutrum sed sem vitae vulputate.", "seen", 1, 3);
INSERT INTO message (content, status, sender_id, receiver_id) values ("ullam maximus suscipit dui, in pharetra metus volutpat sit amet.", "new", 2, 1);
INSERT INTO message (content, status, sender_id, receiver_id) values ("Donec sodales tellus nisi", "seen", 1, 5);
INSERT INTO message (content, status, sender_id, receiver_id) values ("Nulla sit amet ipsum elementum", "new", 4, 1);

INSERT INTO bulletin (title, content, sender_id) values ("Mauris nec quam", "Aenean lacinia mauris a volutpat gravida. Quisque rutrum, magna ut iaculis commodo, justo libero volutpat sem, nec egestas enim nulla quis arcu. Aliquam consequat auctor venenatis. Pellentesque laoreet felis mi, quis aliquam magna egestas in. Integer scelerisque venenatis nisi, sed pharetra velit finibus vitae. Sed sodales metus porttitor lectus tincidunt condimentum. Donec aliquam vestibulum ante in faucibus. Praesent vehicula lectus erat, at commodo dolor semper id. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec interdum semper sapien eget dapibus.", 1);
INSERT INTO bulletin (title, content, sender_id) values ("Phasellus maximus", "auris et imperdiet est. Donec non nunc eleifend, malesuada purus et, lacinia mauris. Morbi tincidunt sed ex porta venenatis. Maecenas augue justo, mattis gravida tempor sagittis, porttitor id ligula. Donec nec augue sapien. Sed imperdiet sit amet risus dictum tempor. Fusce iaculis sapien quis euismod molestie. Praesent tincidunt lectus id nibh porttitor, a iaculis est suscipit. Pellentesque dictum mattis odio, vitae placerat nisi porttitor et. Donec mattis nisl purus, non feugiat ligula vulputate eu. Nulla vel ante est. Integer consequat felis lacus, id consectetur risus vehicula ac. Nam laoreet dui a risus volutpat ultricies. ", 1);
INSERT INTO bulletin (title, content, sender_id) values ("tortor urna", "sit amet quam fringilla, ac consectetur nulla rhoncus.", 2);
INSERT INTO bulletin (title, content, sender_id) values ("Nam fringilla", "Suspendisse finibus felis libero, ut accumsan dui facilisis nec. Aliquam rutrum massa et erat feugiat, a varius justo malesuada. Proin vestibulum ligula ligula, commodo vulputate nunc tristique at. Nulla pretium erat magna, ut eleifend erat elementum vitae. Donec et lobortis nulla. Phasellus aliquet enim pharetra orci tempus pretium. Nullam posuere neque in mattis auctor. Donec ac maximus purus. Etiam risus est, fringilla a feugiat non, volutpat in quam. Duis eget tellus orci. Quisque ullamcorper lorem sit amet metus rhoncus cursus. Nulla posuere nibh leo, non semper odio sodales nec. Aliquam sapien magna, iaculis vitae cursus nec, pulvinar vel ligula. Donec id tempor tellus.", 2);

INSERT INTO bulletin_receiver (bulletin_id, course_id) values (1,1);
INSERT INTO bulletin_receiver (bulletin_id, course_id) values (2,null);
INSERT INTO bulletin_receiver (bulletin_id, course_id) values (3,null);
INSERT INTO bulletin_receiver (bulletin_id, course_id) values (4, 1);
INSERT INTO bulletin_receiver (bulletin_id, course_id) values (4, 2);

INSERT INTO course (name, description, location, start_date, end_date, teacher_id) values ("Math 1", "simple math course", "Room 124", "2024-05-22", "2024-07-23", 1);
INSERT INTO course (name, description, location, start_date, end_date, teacher_id) values ("English 3", "English course which teaches students to read", "Room 37", "2024-04-13", "2024-05-27", 2);

INSERT INTO course_student (course_id, student_id) values (1, 7);
INSERT INTO course_student (course_id, student_id) values (1, 8);
INSERT INTO course_student (course_id, student_id) values (1, 9);
INSERT INTO course_student (course_id, student_id) values (1, 10);
INSERT INTO course_student (course_id, student_id) values (1, 11);
INSERT INTO course_student (course_id, student_id) values (1, 12);

INSERT INTO course_student (course_id, student_id) values (2, 7);
INSERT INTO course_student (course_id, student_id) values (2, 8);
INSERT INTO course_student (course_id, student_id) values (2, 9);
INSERT INTO course_student (course_id, student_id) values (2, 10);
INSERT INTO course_student (course_id, student_id) values (2, 11);
INSERT INTO course_student (course_id, student_id) values (2, 12);

INSERT INTO course_grade (course_id, student_id, grade) values (2, 7, 6);
INSERT INTO course_grade (course_id, student_id, grade) values (2, 8, 8);
INSERT INTO course_grade (course_id, student_id, grade) values (2, 9, 9);
INSERT INTO course_grade (course_id, student_id, grade) values (2, 10, 4);
INSERT INTO course_grade (course_id, student_id, grade) values (2, 11, 10);

INSERT INTO lesson (course_id, day, week, start_time, end_time) values (1, "Monday", CURDATE(),8*3600, 9*3600);
INSERT INTO lesson (course_id, day, week, start_time, end_time) values (1, "Thursday", CURDATE(), 10*3600, 11*3600);

INSERT INTO lesson (course_id, day, week, start_time, end_time) values (2, "Monday", CURDATE(), 12*3600, 13*3600 + 30*60);
INSERT INTO lesson (course_id, day, week, start_time, end_time) values (2, "Wednesday", CURDATE(), 8*3600, 11*3600);
INSERT INTO lesson (course_id, day, week, start_time, end_time) values (2, "Friday", CURDATE(), 10*3600+60*15, 11*3600 + 60*45);

INSERT INTO exam (course_id, student_id, name, grade) values (1, 7, "final exam", 7);
INSERT INTO exam (course_id, student_id, name, grade) values (1, 8, "final exam", 9);
INSERT INTO exam (course_id, student_id, name, grade) values (1, 9, "final exam", 5);
INSERT INTO exam (course_id, student_id, name, grade) values (1, 10, "final exam", 4);
INSERT INTO exam (course_id, student_id, name, grade) values (1, 11, "final exam", 10);
INSERT INTO exam (course_id, student_id, name, grade) values (1, 12, "final exam", 8);

INSERT INTO homework (course_id, name, description, deadline) values (1, "Assignment 1", "what is 2+2?", "2024-06-07");
INSERT INTO homework (course_id, name, description, deadline) values (1, "Assignment 2", "solve 2*2*1", "2024-06-12");

INSERT INTO homework (course_id, name, description, deadline) values (2, "first task", "read attached document", "2024-05-07");
INSERT INTO homework (course_id, name, description, deadline) values (2, "second task", "read attached document", "2024-05-16");

INSERT INTO homework_file (homework_id, homework_answer_id, name, resource, mimetype) values (3, null, "document to read.txt", "mj9f8whfn", "application/txt");
INSERT INTO homework_file (homework_id, homework_answer_id, name, resource, mimetype) values (4, null, "another document to read.txt", "mpaw89dwf", "application/txt");

INSERT INTO homework_answer (homework_id, student_id, content, done, grade, comment) values (1, 9, "I think its 4 but not sure", 1, null, null);
INSERT INTO homework_answer (homework_id, student_id, content, done, grade, comment) values (1, 10, "this is too hard for me", 1, null, null);
INSERT INTO homework_answer (homework_id, student_id, content, done, grade, comment) values (1, 12, "its 4. Too easy :)", 1, 10, "okay smart ass");

INSERT INTO attendance (lesson_id, student_id, status) values (1, 7, "present");
INSERT INTO attendance (lesson_id, student_id, status) values (1, 8, "present");
INSERT INTO attendance (lesson_id, student_id, status) values (1, 9, "absent");
INSERT INTO attendance (lesson_id, student_id, status) values (1, 10, "present");
INSERT INTO attendance (lesson_id, student_id, status) values (1, 11, "absent");
INSERT INTO attendance (lesson_id, student_id, status) values (1, 12, "present");

INSERT INTO attendance (lesson_id, student_id, status) values (2, 7, "present");
INSERT INTO attendance (lesson_id, student_id, status) values (2, 8, "absent");
INSERT INTO attendance (lesson_id, student_id, status) values (2, 9, "absent");
INSERT INTO attendance (lesson_id, student_id, status) values (2, 10, "present");
INSERT INTO attendance (lesson_id, student_id, status) values (2, 11, "present");
INSERT INTO attendance (lesson_id, student_id, status) values (2, 12, "present");
