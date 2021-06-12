import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AlterStatementAddReceivedId1623337233611 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.addColumn(
        "statements",
        new TableColumn({
          name: "received_id",
          type: "varchar",
          isNullable: true,
        })
      );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.dropColumn("statements", "received_id");
    }

}
