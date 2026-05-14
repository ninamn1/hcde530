# Week 6 — Competency Claim

## C6 — Data Visualization

I created three Plotly charts in my Jupyter notebook to support my analysis of the top 100 anime, with the Q3 horizontal bar chart — comparing average user scores across five decades — being my strongest example. After initially building a pie chart, I switched to a bar chart because average scores are not parts of a whole, making a pie chart conceptually misleading. I annotated each bar with the exact average score and title count so readers can see both the ranking and the sample size at a glance without needing to hover. If I had more time, I would refine the color palette, fonts, and overall visual polish to make the charts more presentation-ready.

---

## Chart Justifications

### Q1 — Top 10 Studios by Average Score (Horizontal Bar Chart)
I chose a horizontal bar chart because it makes it easy to compare average scores across studios side by side, and horizontal bars are well suited for long category labels like studio names (e.g., "Bandai Namco Pictures"). I also wanted it to match the Q3 chart style for visual consistency across the notebook.

### Q2 — Top 5 Genres by Frequency (Vertical Column Chart)
I chose a vertical column chart because it is the simplest and most familiar way to show counts across a small number of categories. The ranking from most to least frequent genre is immediately obvious, and the chart type is easy for anyone to read without needing extra explanation.

### Q3 — Average Score by Decade (Horizontal Bar Chart)
I initially built a pie chart, but switched to a horizontal bar chart because average scores are not parts of a whole — a pie chart was conceptually misleading. The scores across decades were also very close together (8.72–8.82), so a bar chart with a narrowed x-axis (starting at 8.6) made those small but meaningful differences visually clear. Each bar is annotated with the exact score and title count so the reader can assess both the ranking and the sample size at a glance.