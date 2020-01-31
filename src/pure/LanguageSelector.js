// import React from 'react'

// import { Classes, MenuItem } from "@blueprintjs/core"
// import { ItemRenderer, ItemPredicate, Select } from "@blueprintjs/select"

// const FilmSelect = Select.ofType();

// const filterFilm = (query, film) => {
//   return film.title.toLowerCase().indexOf(query.toLowerCase()) >= 0;
// };

// const renderFilm = (item, { handleClick, modifiers }) => {
//   if (!modifiers.filtered) {
//     return null;
//   }
//   return (
//     <MenuItem
//       className={modifiers.active ? Classes.ACTIVE : ""}
//       key={film.title}
//       label={film.year}
//       onClick={handleClick}
//       text={film.title}
//     />
//   );
// };

// <FilmSelect itemPredicate={filterFilm} itemRenderer={renderFilm} items={...} onItemSelect={...} />