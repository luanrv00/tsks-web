import React from 'react'
import styles from './index.module.css'

export function Button({value, onClick}) {
  return (
    <button className={styles.button} onClick={onClick}>
      {value}
    </button>
  )
}
