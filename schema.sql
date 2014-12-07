create table sessions(name text);
create table room_user(session text,name text,lang text);
create table token(token text, expire int);
create table translation_cache(org_lang text, org_message text, to_lang text, to_text text,access int);