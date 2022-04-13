package edu.brynmawr.cs353.thefridge;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //automatically redirects to the add item page - change to showing
        //  home page once created
        moveToAddItem();
    }

    public void moveToAddItem() {
        Intent intent = new Intent(this, AddItemActivity.class);
        startActivity(intent);
    }
}