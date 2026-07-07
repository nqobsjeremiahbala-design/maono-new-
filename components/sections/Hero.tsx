import Link from 'next/link'
import styles from './Hero.module.css'

export function Hero() {
  return (
    <header className={styles.hero}>
      <div className={styles.vignette} />

      {/*
        BULL ILLUSTRATION — placeholder derived from the reference render.
        Swap /public/assets/bull-scene.png with the production 3D asset
        (recommended ~900×820, transparent or navy-matched PNG). No code change.
      */}
      <div className={styles.illusLayer}>
        <img
          className={styles.illusImg}
          src="/assets/bull-scene.png"
          alt="Charging bull with ascending candlestick chart, gold trend line and perspective trading-floor grid"
        />
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>
          <p className={styles.eyebrow}>TRADING</p>
          <h1 className={styles.h1}>INSIGHTS</h1>
          <p className={styles.h2}>RE-DEFINED</p>

          <div className={styles.sub}>
            <span>Expert Analysis.</span>
            <span>Proven Strategies.</span>
            <span>Real Market Edge.</span>
          </div>

          <div className={styles.heroCta}>
            <Link href="/courses" className={styles.btnOutline}>EXPLORE COURSES</Link>
            <Link href="/register" className={styles.btnPrimary}>START LEARNING</Link>
          </div>
        </div>
      </div>
    </header>
  )
}
