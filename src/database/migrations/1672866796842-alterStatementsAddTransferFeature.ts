import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class alterStatementsAddTransferFeature1672866796842 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'statements', 
            new TableColumn({
                name: 'sender_id',
                type: 'varchar',
                isNullable: true,
                default: null
                }
            )
        )

        await queryRunner.addColumn(
            'statements', 
            new TableColumn({
                name: 'receiver_id',
                type: 'varchar',
                isNullable: true,
                default: null
                }
            )
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('statements', 'sender_id')
        await queryRunner.dropColumn('statements', 'receiver_id')
    }

}
