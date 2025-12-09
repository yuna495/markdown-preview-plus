# Markdown Demo

## markmap

```markmap
## マークマップ表示デモ
マインドマップのようにマークダウンの内容を図で表現します。

### 見出しレベル3

- **見出し**:
  情報を整理するための階層構造を作成します。
- **リスト**:
  情報を箇条書きに整理します。
- **強調**:
  **太字**または*斜体*。
- `1行コードフェンス`
- コードフェンス
    ```python
    print("hello")
    ```

### リストの例

- 最初の項目
- 2番目の項目
  - 入れ子の項目 A
  - 入れ子の項目 B
- 3番目の項目

### 番号付きリストの例

1. ステップ 1: 準備
1. ステップ 2: 実行
1. ステップ 3: [リンク](https://)
1. ステップ 4: リンク先を表示

```

## mermaid

- Flowchart

```mermaid
graph TD;
    A[開始] --> B[処理];
    B --> C{判断};
    C -- はい --> D[処理1];
    C -- いいえ --> E[処理2];
    D --> F[終了];
    E --> F;
```

- Sequence

```mermaid
sequenceDiagram
    participant Client
    participant Server
    participant Database

    Client->>+Server: リクエスト送信
    Server->>+Database: データ問い合わせ
    Database-->>-Server: 結果返却
    Server-->>-Client: レスポンス送信

    Note over Client,Server: REST API通信

    alt データあり
        Client->>Server: データ更新要求
        Server->>Database: 更新実行
    else データなし
        Client->>Server: データ作成要求
        Server->>Database: 作成実行
    end
```

- Crass Diagram

```mermaid
classDiagram
    class Person {
        +String name
        +int age
        +getDetails() String
    }

    class Employee {
        +int salary
        +String position
        +calculateBonus() int
    }

    class Manager {
        -List~Employee~ team
        +addTeamMember(Employee) void
    }

    Person <|-- Employee
    Employee <|-- Manager
    Manager o-- Employee
```

- State Diagram

```mermaid
stateDiagram-v2
    [*] --> 待機中
    待機中 --> 実行中: 開始
    実行中 --> 完了: 成功
    実行中 --> エラー: 失敗
    完了 --> [*]
    エラー --> 待機中: リトライ
    エラー --> [*]: 中止
```

- ER Diagram

```mermaid
erDiagram
    USER {
        int id PK
        string username
        string email
        string password_hash
    }

    POST {
        int id PK
        int user_id FK
        string title
        string content
        datetime created_at
    }

    COMMENT {
        int id PK
        int post_id FK
        int user_id FK
        string content
        datetime created_at
    }

    USER ||--o{ POST : writes
    POST ||--o{ COMMENT : has
    USER ||--o{ COMMENT : makes
```

- Gantchart

```mermaid
gantt
    title ソフトウェア開発プロジェクト
    dateFormat  YYYY-MM-DD

    section 計画
    プロジェクト開始       :done, a1, 2024-01-01, 2d
    要件分析       :active, a2, after a1, 1w
    システム設計       :a3, after a2, 2w

    section 開発
    バックエンド開発      :crit, a4, after a3, 4w
    フロントエンド開発      :a5, after a3, 4w
    API統合       :a6, after a4, 1w

```

## graphviz

- Flowchart

```graphviz
digraph graph_name {
  graph [rankdir = LR];
  node [shape = none];

  1 -> 2 -> 3 -> 4 [
    arrowhead = none
  ];
}
```

- Record

```graphviz
digraph graph_name {
  graph [
    charset = "UTF-8",
    bgcolor = "#EDEDED",
    rankdir = TB,
    nodesep = 1.1,
    ranksep = 1.05
  ];

  node [
    shape = record,
    fontname = "Migu 1M",
    fontsize = 12,
  ];

  // node define
  alpha [label = "<pl>left|center|<pr>right"];
  beta [label = "<pl>left|<pc>center|<pr>right"];
  gamma [label = "left|center|<pr>right"];
  delta [label = "{left|{<pc>center|{top|middle|bottom}}|right}}"];
  epsilon [label = "{top|<pm>middle|bottom}"];

  // edge define
  alpha:pl -> beta:pl [ label = "a-b", weight = 2.0];
  alpha:pr -> gamma:pr [label = "a-g", weight = 1.0];
  beta:pc -> epsilon:pm [label = "b-e"];
  gamma -> delta:pc [label = "g-d"];
}
```
