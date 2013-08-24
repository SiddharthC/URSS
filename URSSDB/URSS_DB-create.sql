/*# URSS Database Create table statements*/

#
#Create database statements
#
DROP DATABASE IF EXISTS URSS;
CREATE DATABASE URSS;
USE URSS;

#
#Setting foreign key cheks off
#
SET foreign_key_checks=0;

#
#Drop table statements
#
DROP TABLE IF EXISTS TAGDICT;
DROP TABLE IF EXISTS ORNA;
DROP TABLE IF EXISTS ORNATAG;
DROP TABLE IF EXISTS SRNA;
DROP TABLE IF EXISTS SRNATAG;
DROP TABLE IF EXISTS RRNA;
DROP TABLE IF EXISTS RRNATAG;
DROP TABLE IF EXISTS RNASEQ;
DROP TABLE IF EXISTS RNASEQTAG;
DROP TABLE IF EXISTS PREDENS;
DROP TABLE IF EXISTS PREDENSTAG;
DROP TABLE IF EXISTS RNASTR;
DROP TABLE IF EXISTS RNASTRTAG;


#
#Table Tag Dictionary
#
DROP TABLE IF EXISTS TAGDICT;
CREATE TABLE TAGDICT (
	tag varchar(200) NOT NULL,
	PRIMARY KEY (tag)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;


#
#Table Original RNA
#
DROP TABLE IF EXISTS ORNA;
CREATE TABLE ORNA (
	orna_id varchar(200) NOT NULL,
	orna_seq_id varchar(200) NOT NULL,
	known_str_id varchar(200) DEFAULT NULL,
	with_pkn_str_id varchar(200) DEFAULT NULL,
	name varchar(200) DEFAULT NULL,
	rna_class varchar(50) DEFAULT NULL,
	org varchar(50) DEFAULT NULL,
	org_type varchar(50) DEFAULT NULL,
	data_src varchar(200) DEFAULT NULL,
	PRIMARY KEY (orna_id),
	CONSTRAINT orna_seq_id_fk FOREIGN KEY (orna_seq_id) REFERENCES RNASEQ (seq_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	CONSTRAINT orna_known_str_id_fk FOREIGN KEY (known_str_id) REFERENCES RNASTR (str_id) ON DELETE NO ACTION ON UPDATE CASCADE,
	CONSTRAINT orna_with_pkn_str_id_fk FOREIGN KEY (with_pkn_str_id) REFERENCES RNASTR (str_id) ON DELETE NO ACTION ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table Original RNA tags
#
DROP TABLE IF EXISTS ORNATAG;
CREATE TABLE ORNATAG(
	orna_id varchar(200) NOT NULL,
	tag varchar(200) NOT NULL,
	PRIMARY KEY (orna_id,tag),
	CONSTRAINT ornatag_orna_id_fk FOREIGN KEY (orna_id) REFERENCES ORNA (orna_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT ornatag_fk FOREIGN KEY (tag) REFERENCES TAGDICT (tag) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;


#
#Table Shuffled RNA
#
DROP TABLE IF EXISTS SRNA;
CREATE TABLE SRNA (
	srna_id varchar(200) NOT NULL,
	srna_orna_id varchar(200) NOT NULL,
	srna_seq_id varchar(200) NOT NULL,
	shuffle_no varchar(10) NOT NULL,
	shuffle_seed bigint(20) unsigned NOT NULL,
	PRIMARY KEY (srna_id),
	CONSTRAINT srna_orna_id_fk FOREIGN KEY (srna_orna_id) REFERENCES ORNA (orna_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT srna_seq_id_fk FOREIGN KEY (srna_seq_id) REFERENCES RNASEQ (seq_id) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table Shuffled RNA tags
#
DROP TABLE IF EXISTS SRNATAG;
CREATE TABLE SRNATAG(
	srna_id varchar(200) NOT NULL,
	tag varchar(200) NOT NULL,
	PRIMARY KEY (srna_id,tag),
	CONSTRAINT srnatag_srna_id_fk FOREIGN KEY (srna_id) REFERENCES SRNA (srna_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT srnatag_fk FOREIGN KEY (tag) REFERENCES TAGDICT (tag) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;


#
# Table Random RNA
#
DROP TABLE IF EXISTS RRNA;
CREATE TABLE RRNA(
	rrna_id varchar(200) NOT NULL,
	rrna_seq_id varchar(200) NOT NULL,
	random_seed bigint(16) unsigned NOT NULL,
	len int(10) NOT NULL,
	PRIMARY KEY (rrna_id),
	CONSTRAINT rrna_seq_id_fk FOREIGN KEY (rrna_seq_id) REFERENCES RNASEQ (seq_id) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table Random RNA tags
#
DROP TABLE IF EXISTS RRNATAG;
CREATE TABLE RRNATAG(
	rrna_id varchar(200) NOT NULL,
	tag varchar(200) NOT NULL,
	PRIMARY KEY (rrna_id,tag),
	CONSTRAINT rrnatag_rrna_id_fk FOREIGN KEY (rrna_id) REFERENCES RRNA (rrna_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT rrnatag_fk FOREIGN KEY (tag) REFERENCES TAGDICT (tag) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;


#
# Table RNA Sequence
#
DROP TABLE IF EXISTS RNASEQ;
CREATE TABLE RNASEQ(
	seq_id varchar(200) NOT NULL,
	seq_src varchar(200) DEFAULT NULL,
	len int(10) NOT NULL,
	A float NOT NULL,
	U float NOT NULL,
	G float NOT NULL,
	C float NOT NULL,
	AA float NOT NULL,
	AU float NOT NULL,
	AG float NOT NULL,
	AC float NOT NULL,
	UA float NOT NULL,
	UU float NOT NULL,
	UG float NOT NULL,
	UC float NOT NULL,
	GA float NOT NULL,
	GU float NOT NULL,
	GG float NOT NULL,
	GC float NOT NULL,
	CA float NOT NULL,
	CU float NOT NULL,
	CG float NOT NULL,
	CC float NOT NULL,
	AAA float NOT NULL,
	AAU float NOT NULL,
	AAG float NOT NULL,
	AAC float NOT NULL,
	AUA float NOT NULL,
	AUU float NOT NULL,
	AUG float NOT NULL,
	AUC float NOT NULL,
	AGA float NOT NULL,
	AGU float NOT NULL,
	AGG float NOT NULL,
	AGC float NOT NULL,
	ACA float NOT NULL,
	ACU float NOT NULL,
	ACG float NOT NULL,
	ACC float NOT NULL,
	UAA float NOT NULL,
	UAU float NOT NULL,
	UAG float NOT NULL,
	UAC float NOT NULL,
	UUA float NOT NULL,
	UUU float NOT NULL,
	UUG float NOT NULL,
	UUC float NOT NULL,
	UGA float NOT NULL,
	UGU float NOT NULL,
	UGG float NOT NULL,
	UGC float NOT NULL,
	UCA float NOT NULL,
	UCU float NOT NULL,
	UCG float NOT NULL,
	UCC float NOT NULL,
	GAA float NOT NULL,
	GAU float NOT NULL,
	GAG float NOT NULL,
	GAC float NOT NULL,
	GUA float NOT NULL,
	GUU float NOT NULL,
	GUG float NOT NULL,
	GUC float NOT NULL,
	GGA float NOT NULL,
	GGU float NOT NULL,
	GGG float NOT NULL,
	GGC float NOT NULL,
	GCA float NOT NULL,
	GCU float NOT NULL,
	GCG float NOT NULL,
	GCC float NOT NULL,
	CAA float NOT NULL,
	CAU float NOT NULL,
	CAG float NOT NULL,
	CAC float NOT NULL,
	CUA float NOT NULL,
	CUU float NOT NULL,
	CUG float NOT NULL,
	CUC float NOT NULL,
	CGA float NOT NULL,
	CGU float NOT NULL,
	CGG float NOT NULL,
	CGC float NOT NULL,
	CCA float NOT NULL,
	CCU float NOT NULL,
	CCG float NOT NULL,
	CCC float NOT NULL,
	PRIMARY KEY (seq_id)
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table RNA Sequence Dump
#
DROP TABLE IF EXISTS RNASEQDUMP;
CREATE TABLE RNASEQDUMP(
	seq_id varchar(200) NOT NULL,
	seq longtext NOT NULL,
	PRIMARY KEY (seq_id),
	CONSTRAINT rnaseqdump_seq_id_fk FOREIGN KEY (seq_id) REFERENCES RNASEQ (seq_id) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table RNA Sequence tags
#
DROP TABLE IF EXISTS RNASEQTAG;
CREATE TABLE RNASEQTAG(
	seq_id varchar(200) NOT NULL,
	tag varchar(200) NOT NULL,
	PRIMARY KEY (seq_id,tag),
	CONSTRAINT rnaseqtag_seq_id_fk FOREIGN KEY (seq_id) REFERENCES RNASEQ (seq_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT rnaseqtag_fk FOREIGN KEY (tag) REFERENCES TAGDICT (tag) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;


#
# Table Prediction Ensembles
#
DROP TABLE IF EXISTS PREDENS;
CREATE TABLE PREDENS(
	ens_id varchar(200) NOT NULL,
	ens_orna_id varchar(200) DEFAULT NULL,
	ens_srna_id varchar(200) DEFAULT NULL,
	ens_rrna_id varchar(200) DEFAULT NULL,
	pnum_filename varchar(200) DEFAULT NULL,
	window int(3) DEFAULT NULL,
	full_pnum_filename varchar(200) DEFAULT NULL,
	ens_type varchar(100) DEFAULT NULL,
	prog_name varchar(100) DEFAULT NULL,
	str_count int(10) DEFAULT NULL,
	full_str_count int(5) DEFAULT NULL,
	PRIMARY KEY (ens_id),
	INDEX (pnum_filename),
	INDEX (full_pnum_filename),
	CONSTRAINT predens_ens_orna_id_fk FOREIGN KEY (ens_orna_id) REFERENCES ORNA (orna_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT predens_ens_rrna_id_fk FOREIGN KEY (ens_rrna_id) REFERENCES RRNA (rrna_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT predens_ens_srna_id_fk FOREIGN KEY (ens_srna_id) REFERENCES SRNA (srna_id) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table Prediction Ensemble P-nums
#
DROP TABLE IF EXISTS PREDENSPNUM;
CREATE TABLE PREDENSPNUM(
	pnum_filename varchar(200) NOT NULL,
	pnum_file longtext DEFAULT NULL,
	PRIMARY KEY (pnum_filename),
	CONSTRAINT predenspnum_pnum_filename_fk FOREIGN KEY (pnum_filename) REFERENCES PREDENS (pnum_filename) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table Full Prediction Ensemble P-nums
#
DROP TABLE IF EXISTS PREDENSFULLPNUM;
CREATE TABLE PREDENSFULLPNUM(
	full_pnum_filename varchar(200) NOT NULL,
	full_pnum_file longtext DEFAULT NULL,
	PRIMARY KEY (full_pnum_filename),
	CONSTRAINT predensfullpnum_full_pnum_filename_fk FOREIGN KEY (full_pnum_filename) REFERENCES PREDENS (full_pnum_filename) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table Prediction Ensemble tags
#
DROP TABLE IF EXISTS PREDENSTAG;
CREATE TABLE PREDENSTAG(
	ens_id varchar(200) NOT NULL,
	tag varchar(200) NOT NULL,
	PRIMARY KEY (ens_id,tag),
	CONSTRAINT predenstag_ens_id_fk FOREIGN KEY (ens_id) REFERENCES PREDENS (ens_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT predenstag_fk FOREIGN KEY (tag) REFERENCES TAGDICT (tag) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;


#
# Table RNA Structure
#
DROP TABLE IF EXISTS RNASTR;
CREATE TABLE RNASTR(
	str_id varchar(200) NOT NULL,
	str_ens_id varchar(200) DEFAULT NULL,
	seq_id varchar(200) NOT NULL,
	bpseq_filename varchar(200) NOT NULL,
	figure_filename varchar(200) DEFAULT NULL,
	str_src varchar(100) DEFAULT NULL,
	det_method varchar(100) NOT NULL,
	energy float DEFAULT NULL,
	mld int(10) NOT NULL,
	pkn_tot int(5) DEFAULT NULL,
	bp_pkn int(5) DEFAULT NULL,
	stem_tot int(5) DEFAULT NULL,
	bp_stem int(5) DEFAULT NULL,
	hpl_tot int(5) DEFAULT NULL,
	bl_tot int(5) DEFAULT NULL,
	inl_tot int(5) DEFAULT NULL,
	ml_tot int(5) DEFAULT NULL,
	exl_tot int(5) DEFAULT NULL,
	max_hpl_len int(5) DEFAULT NULL,
	min_hpl_len int(5) DEFAULT NULL,
	avg_hpl_len int(5) DEFAULT NULL,
	max_inl_len int(5) DEFAULT NULL,
	min_inl_len int(5) DEFAULT NULL,
	avg_inl_len int(5) DEFAULT NULL,
	max_bl_len int(5) DEFAULT NULL,
	min_bl_len int(5) DEFAULT NULL,
	avg_bl_len int(5) DEFAULT NULL,
	max_ml_len int(5) DEFAULT NULL,
	min_ml_len int(5) DEFAULT NULL,
	avg_ml_len int(5) DEFAULT NULL,
	max_stem_len int(5) DEFAULT NULL,
	min_stem_len int(5) DEFAULT NULL,
	avg_stem_len int(5) DEFAULT NULL,
	stem_A float DEFAULT NULL,
	stem_U float DEFAULT NULL,
	stem_G float DEFAULT NULL,
	stem_C float DEFAULT NULL,
	stem_AA float DEFAULT NULL,
	stem_AU float DEFAULT NULL,
	stem_AG float DEFAULT NULL,
	stem_AC float DEFAULT NULL,
	stem_UU float DEFAULT NULL,
	stem_UG float DEFAULT NULL,
	stem_UC float DEFAULT NULL,
	stem_GG float DEFAULT NULL,
	stem_GC float DEFAULT NULL,
	stem_CC float DEFAULT NULL,
	hpl_fb_tot int(5) DEFAULT NULL,
	hpl_A float DEFAULT NULL,
	hpl_U float DEFAULT NULL,
	hpl_G float DEFAULT NULL,
	hpl_C float DEFAULT NULL,
	hpl_cbpc_AA float DEFAULT NULL,
	hpl_cbpc_AU float DEFAULT NULL,
	hpl_cbpc_AG float DEFAULT NULL,
	hpl_cbpc_AC float DEFAULT NULL,
	hpl_cbpc_UU float DEFAULT NULL,
	hpl_cbpc_UG float DEFAULT NULL,
	hpl_cbpc_UC float DEFAULT NULL,
	hpl_cbpc_GG float DEFAULT NULL,
	hpl_cbpc_GC float DEFAULT NULL,
	hpl_cbpc_CC float DEFAULT NULL,
	bl_fb_tot int(5) DEFAULT NULL,
	bl_A float DEFAULT NULL,
	bl_U float DEFAULT NULL,
	bl_G float DEFAULT NULL,
	bl_C float DEFAULT NULL,
	bl_cbpc_AA float DEFAULT NULL,
	bl_cbpc_AU float DEFAULT NULL,
	bl_cbpc_AG float DEFAULT NULL,
	bl_cbpc_AC float DEFAULT NULL,
	bl_cbpc_UU float DEFAULT NULL,
	bl_cbpc_UG float DEFAULT NULL,
	bl_cbpc_UC float DEFAULT NULL,
	bl_cbpc_GG float DEFAULT NULL,
	bl_cbpc_GC float DEFAULT NULL,
	bl_cbpc_CC float DEFAULT NULL,
	inl_fb_tot int(5) DEFAULT NULL,
	inl_A float DEFAULT NULL,
	inl_U float DEFAULT NULL,
	inl_G float DEFAULT NULL,
	inl_C float DEFAULT NULL,
	inl_cbpc_AA float DEFAULT NULL,
	inl_cbpc_AU float DEFAULT NULL,
	inl_cbpc_AG float DEFAULT NULL,
	inl_cbpc_AC float DEFAULT NULL,
	inl_cbpc_UU float DEFAULT NULL,
	inl_cbpc_UG float DEFAULT NULL,
	inl_cbpc_UC float DEFAULT NULL,
	inl_cbpc_GG float DEFAULT NULL,
	inl_cbpc_GC float DEFAULT NULL,
	inl_cbpc_CC float DEFAULT NULL,
	ml_fb_tot int(5) DEFAULT NULL,
	ml_A float DEFAULT NULL,
	ml_U float DEFAULT NULL,
	ml_G float DEFAULT NULL,
	ml_C float DEFAULT NULL,
	ml_cbp_tot int(5) DEFAULT NULL,
	ml_cbpc_AA float DEFAULT NULL,
	ml_cbpc_AU float DEFAULT NULL,
	ml_cbpc_AG float DEFAULT NULL,
	ml_cbpc_AC float DEFAULT NULL,
	ml_cbpc_UU float DEFAULT NULL,
	ml_cbpc_UG float DEFAULT NULL,
	ml_cbpc_UC float DEFAULT NULL,
	ml_cbpc_GG float DEFAULT NULL,
	ml_cbpc_GC float DEFAULT NULL,
	ml_cbpc_CC float DEFAULT NULL,
	exl_fb_tot float DEFAULT NULL,
	exl_A float DEFAULT NULL,
	exl_U float DEFAULT NULL,
	exl_G float DEFAULT NULL,
	exl_C float DEFAULT NULL,
	exl_cbpc_AA float DEFAULT NULL,
	exl_cbpc_AU float DEFAULT NULL,
	exl_cbpc_AG float DEFAULT NULL,
	exl_cbpc_AC float DEFAULT NULL,
	exl_cbpc_UU float DEFAULT NULL,
	exl_cbpc_UG float DEFAULT NULL,
	exl_cbpc_UC float DEFAULT NULL,
	exl_cbpc_GG float DEFAULT NULL,
	exl_cbpc_GC float DEFAULT NULL,
	exl_cbpc_CC float DEFAULT NULL,
	GNRA_tetrahpl int(5) DEFAULT NULL,
	UNCG_tetrahpl int(5) DEFAULT NULL,
	CUUG_tetrahpl int(5) DEFAULT NULL,
	hpl_GNRA int(5) DEFAULT NULL,
	hpl_UNCG int(5) DEFAULT NULL,
	hpl_CUUG int(5) DEFAULT NULL,
	nt3hpl int(5) DEFAULT NULL,
	nt4hpl int(5) DEFAULT NULL,
	nt5hpl int(5) DEFAULT NULL,
	nt6hpl int(5) DEFAULT NULL,
	nt7hpl int(5) DEFAULT NULL,
	nt8hpl int(5) DEFAULT NULL,
	nt9hpl int(5) DEFAULT NULL,
	nt10hpl int(5) DEFAULT NULL,
	nt11hpl int(5) DEFAULT NULL,
	nt12hpl int(5) DEFAULT NULL,
	nt13hpl int(5) DEFAULT NULL,
	nt14hpl int(5) DEFAULT NULL,
	nt15hpl int(5) DEFAULT NULL,
	nt16plushpl int(5) DEFAULT NULL,
	PRIMARY KEY (str_id),
	INDEX (bpseq_filename),
	INDEX (figure_filename),
	CONSTRAINT rnastr_ens_id_fk FOREIGN KEY (str_ens_id) REFERENCES PREDENS (ens_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT rnastr_seq_id_fk FOREIGN KEY (seq_id) REFERENCES RNASEQ (seq_id) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table RNA Structure File
#
DROP TABLE IF EXISTS RNASTRFILE;
CREATE TABLE RNASTRFILE(
	bpseq_filename varchar(200) NOT NULL,
	bpseq_file longtext DEFAULT NULL,
	PRIMARY KEY (bpseq_filename),
	CONSTRAINT rnastrfile_bpseq_filename_fk FOREIGN KEY (bpseq_filename) REFERENCES RNASTR (bpseq_filename) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table RNA Figure
#
DROP TABLE IF EXISTS RNASTRFIG;
CREATE TABLE RNASTRFIG(
	figure_filename varchar(200) NOT NULL,
	figure longblob DEFAULT NULL,
	PRIMARY KEY (figure_filename),
	CONSTRAINT rnastrfig_figure_filename_fk FOREIGN KEY (figure_filename) REFERENCES RNASTR (figure_filename) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;
#
# Table RNA Structure tags
#
DROP TABLE IF EXISTS RNASTRTAG;
CREATE TABLE RNASTRTAG(
	str_id varchar(200) NOT NULL,
	tag varchar(200) NOT NULL,
	PRIMARY KEY (str_id,tag),
	CONSTRAINT rnastrtag_str_id_fk FOREIGN KEY (str_id) REFERENCES RNASTR (str_id) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT rnastrtag_fk FOREIGN KEY (tag) REFERENCES TAGDICT (tag) ON DELETE CASCADE ON UPDATE CASCADE
	) ENGINE=InnoDB DEFAULT CHARSET=latin1;

#
#Setting foreign key cheks on
#
SET foreign_key_checks=1;