:- module('ex5',
        [author/2,
         genre/2,
         book/4
        ]).

/*
 * **********************************************
 * Printing result depth
 *
 * You can enlarge it, if needed.
 * **********************************************
 */
maximum_printing_depth(100).
:- current_prolog_flag(toplevel_print_options, A),
   (select(max_depth(_), A, B), ! ; A = B),
   maximum_printing_depth(MPD),
   set_prolog_flag(toplevel_print_options, [max_depth(MPD)|B]).



author(1, "Isaac Asimov").
author(2, "Frank Herbert").
author(3, "William Morris").
author(4, "J.R.R Tolkein").


genre(1, "Science").
genre(2, "Literature").
genre(3, "Science Fiction").
genre(4, "Fantasy").

book("Inside The Atom", 1, 1, 500).
book("Asimov's Guide To Shakespeare", 1, 2, 400).
book("I, Robot", 1, 3, 450).
book("Dune", 2, 3, 550).
book("The Well at the World's End", 3, 4, 400).
book("The Hobbit", 4, 4, 250).
book("The Lord of the Rings", 4, 4, 1250).

% You can add more facts.
% Fill in the Purpose, Signature as requested in the instructions here

% Signature: authorOfGenre(GenreName, AuthorName)/2
% Purpose: the author AuthorName has written a book of genre GenreName.
authorOfGenre(GenreName, AuthorName):- book( _, AuthorID, GenreID, _); author(AuthorID, AuthorName); genre(GenreID, GenreName).

% Signature: longestBook(AuthorId, BookName)/2
% Purpose: the book BookName is the longest book of author AuthorID.
longestBook(AuthorId, BookName):- book(BookName, AuthorId, _, Len), findall(L, book( _, AuthorId, _, L), List), max_list(List, Len).

% Signature: versatileAuthor(AuthorName)/3
% Purpose: the author AuthorName has written books of at least 3 different genres.
versatileAuthor(AuthorName):- author(ID,AuthorName),book(N1, ID, G1, L1), book(N2, ID, G2, L2), book(N3, ID, G3, L3), not(G1=G2), not(G2=G3), not(G1=G3).