# קורס בטיחות למהנדסים — Regression Course

חומרי תרגול לקורס **"Safety Management for Engineers"** באוניברסיטת אריאל.
12 מצגות אינטראקטיביות + מחברות Jupyter, סמסטר אביב 2026.

---

## דף הקורס

**[פתח את דף הקורס](https://razelbaz1.github.io/regression-course/presentations/)**

הדף מאחד במקום אחד את כל חומרי הלמידה — 12 כרטיסי שיעור מאורגנים ב-4 בלוקים
(Linear · Logistic · Poisson · NB), עם קישור ישיר לכל מצגת ולכל מחברת Jupyter.

הדף **מתעדכן אוטומטית**: כל חומר חדש שמועלה לריפו מופיע באתר תוך דקות. אין צורך להוריד או לרענן ידנית.

---

## מבנה החומר

לכל שיעור שני סוגי תוכן, שמשלימים זה את זה:

| סוג | מיקום בריפו | שימוש |
|---|---|---|
| **מצגת אינטראקטיבית** | `presentations/lesson_NN.html` | צפייה בדפדפן — הסברים, ויזואליות, שאלות לכיתה. |
| **מחברת Jupyter** | `lessonN/.../*Tirgul.ipynb` | הרצת קוד פייתון מקומית ב-JupyterLab. |

המצגת מתאימה לצפייה ועיון; המחברת מתאימה לעבודה ידיים-על על הדאטה.

---

## הרצת המחברות מקומית

דרישות:

```
pip install pandas numpy matplotlib statsmodels tqdm
```

מומלץ לעבוד עם **JupyterLab** או **Jupyter Notebook**. כל מחברת מטעינה את הדאטה שלה
מתת-תיקיית `pkl/` באותו שיעור — ודאו שאתם מריצים את המחברת מהתיקייה שלה
(או מהתיקייה הראשית של הריפו, שכל הנתיבים יחסיים לעבודה).

---

## רשימת השיעורים

| # | נושא | בלוק |
|---|---|---|
| 1 | OLS Foundations & statsmodels | Linear |
| 2 | Transformations | Linear |
| 3 | Multivariate Regression | Linear |
| 4 | Dummy Variables | Linear |
| 5 | Polynomial + Parameter Selection | Linear |
| 6 | Interactions | Linear |
| 7 | Logistic Regression — Intro | Logistic |
| 8 | Maximum Likelihood Estimation | Logistic |
| 9 | Confusion Matrix & Evaluation | Logistic |
| 10 | Poisson — Counting & Offset | Poisson |
| 11 | Dispersion | Poisson |
| 12 | Negative Binomial | Negative Binomial |

שיעורים שעדיין מסומנים כ**"בקרוב"** בדף הקורס יפורסמו במהלך הסמסטר.

---

TA: רז אלבז · אוניברסיטת אריאל · סמסטר אביב 2026
