import {MigrationInterface, QueryRunner, TableColumn, TableForeignKey} from "typeorm";

export class statementsTable1675073072539 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        "statements",
        new TableColumn({
          name: "sender_id",
          type: "uuid",
          isNullable: true,
        })
      );

      await queryRunner.createForeignKey(
        "statements",
        new TableForeignKey({
            columnNames: ["sender_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "users",
            onDelete: "CASCADE",
        }),
    )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      const table = await queryRunner.getTable("statements");

      const foreignKey = table?.foreignKeys.find(
          (fk) => fk.columnNames.indexOf("sender_id") !== -1,
      )

      if (foreignKey) {
        await queryRunner.dropForeignKey("statements", foreignKey)
        await queryRunner.dropColumn("statements", "sender_id")
      }
    }

}
