import React, { useState, useMemo } from "react";
import styles from "./DropDownList.module.scss";
import { GetIngredient } from "@/feautures/recipes/types";
import MyInput from "../MyInput/MyInput";

export type SelectedIngredient = GetIngredient & { amount: number };

type Props = {
  ingredients?: GetIngredient[];
  selected: SelectedIngredient[];
  onChange: (selected: SelectedIngredient[]) => void;
};

const DropDownList: React.FC<Props> = ({
  ingredients = [],
  selected,
  onChange,
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<GetIngredient | null>(null);
  const [amount, setAmount] = useState<string>("1");

  const filtered = useMemo(() => {
    const lower = search.toLowerCase();
    return ingredients
      .filter(
        (i) =>
          i.name.toLowerCase().includes(lower) &&
          !selected.some((s) => s.id === i.id)
      )
      .slice(0, 20);
  }, [search, ingredients, selected]);

  const handleSelect = (item: GetIngredient) => {
    setActiveItem(item);
    setSearch(item.name);
    setIsOpen(false);
  };

  const handleAdd = () => {
    if (activeItem) {
      const parsed = parseInt(amount, 10) || 1;
      const updated = [...selected, { ...activeItem, amount: parsed }];
      onChange(updated);

      setSearch("");
      setActiveItem(null);
      setAmount("1");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectedContainer}>
        {selected.map((item) => (
          <div key={item.id} className={styles.tag}>
            <span className={styles.tagLabel}>
              {item.name} {item.amount}
              {item.measurement_unit}
            </span>
            <button
              type="button"
              className={styles.removeButton}
              onClick={() => onChange(selected.filter((s) => s.id !== item.id))}
            >
              x
            </button>
          </div>
        ))}
      </div>
      <div className={styles.inputGroup}>
        <div className={styles.selectBox}>
          <input
            type="text"
            className={styles.inputSearch}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setIsOpen(true);
              setActiveItem(null);
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 150)}
            placeholder={
              ingredients.length ? "Найди ингредиент..." : "Нет ингредиентов"
            }
            disabled={!ingredients.length}
          />
          {isOpen && filtered.length > 0 && (
            <ul className={styles.dropdownList}>
              {filtered.map((item) => (
                <li
                  key={item.id}
                  className={styles.listItem}
                  onMouseDown={() => handleSelect(item)}
                >
                  {item.name} ({item.measurement_unit})
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.addContainer}>
          <p className={styles.countHead}>кол-во:</p>
          <MyInput
            style={{
              padding:5, 
              width:100
            }}
            value={amount}
            changer={(val) => {
              if (/^\d*$/.test(val)) {
                setAmount(val); // Только если введены цифры
              }
            }}
            error={parseInt(amount, 10) < 1 ? "Минимум 1" : undefined}
            disabled={!activeItem}
          />
          <button
            type="button"
            className={styles.addButton}
            onClick={handleAdd}
            disabled={!activeItem}
          >
            Добавить
          </button>
        </div>
      </div>
    </div>
  );
};

export default DropDownList;
